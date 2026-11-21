import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRentalQuoteCreate, validateContact } from '../functions/_shared/core.js';
import { onRequest } from '../functions/_middleware.js';

const payload = {
  name: 'Rental Test', email: 'rental-test@example.com', configuration: '512GB',
  period: 'Hourly', workload: 'Model evaluation, 4TB SSD, preferred dates to be confirmed.',
  lead_context: {
    first_touch: { landing_page: 'https://mac-studio.hoflings.com/', utm: { source: 'google', medium: 'cpc' } },
    last_touch: { landing_page: 'https://mac-studio.hoflings.com/', click_ids: { gclid: 'synthetic-test-click' } },
    browser: { timezone: 'America/New_York', language: 'en-US' },
  },
};
const env = {
  SUPABASE_URL: 'https://database.example.com', SUPABASE_SERVICE_ROLE_KEY: 'test-only',
  SENDGRID_API_KEY: 'test-only', SENDGRID_FROM_EMAIL: 'support@example.com',
  CONTACT_TO_EMAIL: 'owner@example.com',
};
let counter = 0;
const request = body => new Request('https://mac-studio.hoflings.com/rental-quotes', {
  method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': `test-${counter++}` },
  body: JSON.stringify(body),
});

test('rental requests use the existing contacts storage and both notification emails', async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push({ url, options, body });
    if (url.includes('/rest/v1/contacts') && options.method === 'POST')
      return Response.json([{ ...body, id: 'test-contact' }], { status: 201 });
    if (url.includes('sendgrid')) return new Response(null, { status: 202 });
    return new Response(null, { status: 204 });
  };
  try {
    const response = await handleRentalQuoteCreate(request(payload), env);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, id: 'test-contact', notified: true });
    const insert = calls.find(c => c.options.method === 'POST' && c.url.includes('/rest/v1/contacts'));
    assert.equal(insert.body.source, 'mac-studio.hoflings.com');
    assert.match(insert.body.message, /Configuration: 512GB\nRental period: Hourly/);
    assert.match(insert.body.message, /4TB SSD/);
    assert.equal(insert.body.attribution.last_touch.channel, 'Google Ads');
    assert.equal(insert.body.visitor_context.browser_timezone, 'America/New_York');
    assert.equal(insert.options.headers.apikey, 'test-only');
    const emails = calls.filter(c => c.url.includes('sendgrid'));
    assert.equal(emails.length, 2);
    assert.match(emails[0].body.personalizations[0].subject, /Mac Studio rental quote/);
    assert.equal(emails[1].body.personalizations[0].to[0].email, payload.email);
    assert.match(JSON.stringify(emails[1].body.content), /No rental is booked/);
    assert.doesNotMatch(JSON.stringify(emails[1].body.content), /recruiter/);
    assert.ok(calls.some(c => c.options.method === 'PATCH' && c.body.notified === true));
  } finally { globalThis.fetch = original; }
});

test('invalid configuration, period and workload are rejected before external calls', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Validation must not call an external service'); };
  try {
    const response = await handleRentalQuoteCreate(request({ ...payload, configuration: '1024GB', period: 'Free', workload: '' }), env);
    assert.equal(response.status, 422);
    const result = await response.json();
    assert.deepEqual(Object.keys(result.fields).sort(), ['configuration', 'period', 'workload']);
    assert.equal((await handleRentalQuoteCreate(request({ ...payload, website: 'spam' }), env)).status, 200);
    assert.equal(validateContact({ name: payload.name, email: payload.email, message: payload.workload }).ok, false);
  } finally { globalThis.fetch = original; }
});

test('failed storage never reports success or sends email', async () => {
  const original = globalThis.fetch;
  const log = console.error;
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json({ message: 'Unavailable' }, { status: 503 }); };
  console.error = () => {};
  try {
    const response = await handleRentalQuoteCreate(request(payload), env);
    assert.equal(response.status, 500);
    assert.equal(calls, 1);
  } finally { globalThis.fetch = original; console.error = log; }
});

test('rental API reaches Pages Functions rather than static assets', async () => {
  const response = await onRequest({
    request: request(payload),
    next: () => new Response('backend'),
    env: { ASSETS: { fetch: () => { throw new Error('API was routed to assets'); } } },
  });
  assert.equal(await response.text(), 'backend');
});
