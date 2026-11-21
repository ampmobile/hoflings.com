import test from 'node:test';
import assert from 'node:assert/strict';
import { handleAdminContactReply } from '../functions/_shared/core.js';

const contactId = '93a8aa87-ae5d-48f2-95a5-8e8af0174519';
const sendId = '0ed52cd9-a8d8-45c8-8a61-d9217b3bba9b';
const input = { contact_id: contactId, request_id: sendId, subject: 'Re: your inquiry', body: 'Hello, we can help. <script>literal text</script>', to: 'ignored@example.com', from: 'ignored@example.com' };
let sequence = 0;
const request = (data = input, { signedIn = true, origin = 'https://hoflings.com' } = {}) => new Request('https://hoflings.com/admin/contact-replies', {
  method: 'POST', headers: { 'content-type': 'application/json', origin, ...(signedIn ? { cookie: 'hof_admin=test-session' } : {}) },
  body: JSON.stringify(data),
});

function fixture({ mail = 'accepted', insertFailure = false, finalSaveFailure = false } = {}) {
  const admin = `admin-${sequence++}@example.com`;
  const env = { SUPABASE_URL: 'https://database.example.com', SUPABASE_ANON_KEY: 'anon-test', SUPABASE_SERVICE_ROLE_KEY: 'service-test', ADMIN_EMAIL: admin, SENDGRID_API_KEY: 'sendgrid-test', SENDGRID_FROM_EMAIL: 'different@example.com' };
  const rows = new Map(), sent = [], contact = { id: contactId, name: 'Local test', email: 'recipient@example.com', status: 'new' };
  const fetch = async (target, options = {}) => {
    const url = new URL(target);
    if (url.pathname === '/auth/v1/user') return Response.json({ email: admin });
    if (url.pathname === '/rest/v1/contact_replies') {
      const id = url.searchParams.get('id')?.replace(/^eq\./, '');
      if (!options.method || options.method === 'GET') return Response.json(rows.has(id) ? [rows.get(id)] : []);
      const body = JSON.parse(options.body);
      if (options.method === 'POST') {
        if (insertFailure) return Response.json({ error: 'storage unavailable' }, { status: 503 });
        if (rows.has(body.id)) return Response.json({ error: 'duplicate' }, { status: 409 });
        const row = { ...body, created_at: new Date().toISOString() };
        rows.set(body.id, row);return Response.json([row], { status: 201 });
      }
      if (finalSaveFailure) return Response.json({ error: 'storage unavailable' }, { status: 503 });
      const updated = { ...rows.get(id), ...body };rows.set(id, updated);return Response.json([updated]);
    }
    if (url.pathname === '/rest/v1/contacts') {
      if (options.method === 'PATCH') { Object.assign(contact, JSON.parse(options.body));return new Response(null, { status: 204 }); }
      return Response.json([contact]);
    }
    if (url.hostname === 'api.sendgrid.com') {
      sent.push(JSON.parse(options.body));
      if (mail === 'uncertain') throw new TypeError('connection interrupted');
      if (mail === 'rejected') return Response.json({ error: 'invalid sender' }, { status: 400 });
      return new Response(null, { status: 202, headers: { 'x-message-id': 'provider-test-id' } });
    }
    throw new Error(`Unexpected external request: ${target}`);
  };
  return { env, rows, sent, contact, fetch };
}

async function withFixture(options, action) {
  const original = globalThis.fetch, f = fixture(options);
  globalThis.fetch = f.fetch;
  try { await action(f); } finally { globalThis.fetch = original; }
}

test('reply goes to stored recipient from support, persists history and marks contacted', async () => {
  await withFixture({}, async f => {
    const response = await handleAdminContactReply(request(), f.env);
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.reply.status, 'sent');
    assert.equal(f.contact.status, 'contacted');
    assert.equal(f.sent.length, 1);
    assert.equal(f.sent[0].from.email, 'support@hoflings.com');
    assert.equal(f.sent[0].reply_to.email, 'support@hoflings.com');
    assert.equal(f.sent[0].personalizations[0].to[0].email, 'recipient@example.com');
    assert.ok(f.sent[0].content[1].value.includes('&lt;script&gt;'));
    assert.equal(f.rows.get(sendId).provider_message_id, 'provider-test-id');
    const replay = await handleAdminContactReply(request(), f.env);
    assert.equal((await replay.json()).replayed, true);
    assert.equal(f.sent.length, 1);
  });
});

test('concurrent clicks cannot send the same reply twice', async () => {
  await withFixture({}, async f => {
    await Promise.all([handleAdminContactReply(request(), f.env), handleAdminContactReply(request(), f.env)]);
    assert.equal(f.sent.length, 1);
  });
});

test('unauthenticated, cross-origin and invalid requests never send email', async () => {
  await withFixture({}, async f => {
    assert.equal((await handleAdminContactReply(request(input, { signedIn: false }), f.env)).status, 401);
    assert.equal((await handleAdminContactReply(request(input, { origin: 'https://unrelated.example' }), f.env)).status, 403);
    assert.equal((await handleAdminContactReply(request({ ...input, subject: 'Header\r\ninjection' }), f.env)).status, 422);
    assert.equal(f.sent.length, 0);
    assert.equal(f.rows.size, 0);
  });
});

test('storage must claim the send request before contacting SendGrid', async () => {
  await withFixture({ insertFailure: true }, async f => {
    assert.equal((await handleAdminContactReply(request(), f.env)).status, 503);
    assert.equal(f.sent.length, 0);
  });
});

test('definite provider rejection remains failed, without marking contacted', async () => {
  await withFixture({ mail: 'rejected' }, async f => {
    const response = await handleAdminContactReply(request(), f.env);
    assert.equal(response.status, 502);
    assert.equal((await response.json()).retryable, true);
    assert.equal(f.rows.get(sendId).status, 'failed');
    assert.equal(f.contact.status, 'new');
  });
});

test('uncertain provider outcomes stay protected from blind resending', async () => {
  await withFixture({ mail: 'uncertain' }, async f => {
    const first = await handleAdminContactReply(request(), f.env);
    assert.equal((await first.json()).pending, true);
    assert.equal(f.rows.get(sendId).status, 'unknown');
    const replay = await handleAdminContactReply(request(), f.env);
    assert.equal(replay.status, 409);
    assert.equal(f.sent.length, 1);
  });
});

test('provider acceptance followed by history-save failure never permits a duplicate', async () => {
  await withFixture({ finalSaveFailure: true }, async f => {
    const response = await handleAdminContactReply(request(), f.env);
    assert.equal(response.status, 200);
    assert.match((await response.json()).notice, /Do not resend/);
    assert.equal((await handleAdminContactReply(request(), f.env)).status, 409);
    assert.equal(f.sent.length, 1);
  });
});
