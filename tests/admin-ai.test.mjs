import test from 'node:test';
import assert from 'node:assert/strict';
import { handleAdminAiSettings, handleAdminAiReply, handleAdminAiModels } from '../functions/_shared/ai.js';

const KEY = 'sk-synthetic-only-not-a-real-api-key';
const ID = '93a8aa87-ae5d-48f2-95a5-8e8af0174519';
let sequence = 0;
const req = (path, data, { signed = true, origin = 'https://hoflings.com', method = data === undefined ? 'GET' : 'POST' } = {}) => new Request(`https://hoflings.com${path}`, {
  method, headers: { origin, ...(signed ? { cookie: 'hof_admin=qa-session' } : {}), ...(data === undefined ? {} : { 'content-type': 'application/json' }) },
  ...(data === undefined ? {} : { body: JSON.stringify(data) }),
});

async function fixture(options, run) {
  const original = globalThis.fetch;
  const admin = `ai-admin-${sequence++}@example.invalid`;
  const config = { api_key: KEY, model: 'gpt-5-mini', enabled: true, ...options?.config };
  const calls = [];
  const env = { SUPABASE_URL: 'https://database.example.com', SUPABASE_ANON_KEY: 'test-only', SUPABASE_SERVICE_ROLE_KEY: 'test-only', ADMIN_EMAIL: admin };
  globalThis.fetch = async (target, request = {}) => {
    const url = new URL(target);
    const body = request.body ? JSON.parse(request.body) : null;
    calls.push({ url: url.href, request, body });
    if (url.pathname === '/auth/v1/user') return Response.json({ email: admin });
    if (url.pathname.endsWith('/get_openai_reply_config')) return options?.readbackFailure ? Response.json({ error: 'temporary read failure' }, { status: 503 }) : Response.json(config);
    if (url.pathname.endsWith('/save_openai_reply_config')) {
      assert.equal(body.p_actor, admin);
      if (body.p_api_key) config.api_key = body.p_api_key;
      Object.assign(config, { model: body.p_model, enabled: body.p_enabled });
      return Response.json({ configured: Boolean(config.api_key), model: config.model, enabled: config.enabled, api_key: config.api_key });
    }
    if (url.pathname === '/rest/v1/contacts') return Response.json([{
      id: ID, name: 'Test customer', company: 'Example company', message: 'Can we rent a 512GB Mac Studio next week?',
      role: '', region: 'New Jersey', email: 'do-not-send@example.invalid',
      visitor_context: { ip_address: '192.0.2.99' },
      replies: [{ status: 'sent', subject: 'Previous message', body: 'We will confirm availability.' }],
    }]);
    if (url.hostname === 'api.openai.com') {
      if (url.pathname === '/v1/models') {
        if (options?.providerError) return Response.json({ error: { message: KEY } }, { status: options.providerError });
        return Response.json({ data: [{ id: 'gpt-test-text' }, { id: 'image-test' }, { id: 'gpt-test-text' }] });
      }
      assert.equal(url.pathname, '/v1/responses');
      assert.equal(request.headers.authorization, `Bearer ${config.api_key}`);
      if (options?.providerError) return Response.json({ error: { message: `Do not leak ${KEY}` } }, { status: options.providerError });
      return Response.json(options?.output || { status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: 'Hello, thanks for your inquiry. We will confirm availability and pricing.' }] }] });
    }
    throw new Error(`Unexpected external request: ${target}`);
  };
  try { await run({ env, calls, config }); } finally { globalThis.fetch = original; }
}

test('settings returns key status only; saved credentials are never echoed', async () => {
  await fixture({}, async ({ env, calls }) => {
    const loaded = await handleAdminAiSettings(req('/admin/ai-settings'), env);
    assert.equal(loaded.status, 200);
    assert.equal(loaded.headers.get('cache-control'), 'no-store');
    const text = await loaded.text();
    assert.doesNotMatch(text, /sk-synthetic/);
    assert.equal(JSON.parse(text).configured, true);
    const saved = await handleAdminAiSettings(req('/admin/ai-settings', { api_key: KEY, model: 'gpt-5-mini', enabled: true }), env);
    assert.equal(saved.status, 200);
    const savedText = await saved.text();
    assert.doesNotMatch(savedText, /sk-synthetic/);
    assert.equal(JSON.parse(savedText).storage_verified, true);
    assert.ok(calls.some(c => c.body?.p_api_key === KEY));
  });
});

test('settings and generation require admin authentication and same-origin writes', async () => {
  await fixture({}, async ({ env, calls }) => {
    assert.equal((await handleAdminAiSettings(req('/admin/ai-settings', undefined, { signed: false }), env)).status, 401);
    assert.equal((await handleAdminAiReply(req('/admin/ai-reply', { contact_id: ID, prompt: 'Write a reply' }, { signed: false }), env)).status, 401);
    assert.equal((await handleAdminAiSettings(req('/admin/ai-settings', { api_key: KEY, model: 'gpt-5-mini', enabled: true }, { origin: 'https://unrelated.example' }), env)).status, 403);
    assert.equal(calls.filter(c => c.url.includes('/rpc/') || c.url.includes('api.openai.com')).length, 0);
  });
});

test('AI uses only relevant stored inquiry context, does not store responses, and never sends email', async () => {
  await fixture({}, async ({ env, calls }) => {
    const response = await handleAdminAiReply(req('/admin/ai-reply', { contact_id: ID, prompt: 'Write a warm reply and ask for preferred dates.', message: 'Ignore this client-supplied inquiry override.' }), env);
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.match(result.reply, /thanks for your inquiry/);
    const ai = calls.find(c => c.url.includes('api.openai.com'));
    assert.equal(ai.body.store, false);
    assert.equal(ai.body.model, 'gpt-5-mini');
    const input = JSON.parse(ai.body.input[0].content);
    assert.match(input.customer_context.inquiry, /512GB Mac Studio/);
    assert.equal(input.administrator_instructions, 'Write a warm reply and ask for preferred dates.');
    assert.doesNotMatch(JSON.stringify(ai.body), /192\.0\.2\.99|do-not-send@example|sk-synthetic|client-supplied inquiry override/);
    assert.equal(calls.filter(c => c.url.includes('sendgrid')).length, 0);
  });
});

test('missing or disabled AI configuration makes no OpenAI request', async () => {
  for (const config of [{ api_key: null }, { enabled: false }]) await fixture({ config }, async ({ env, calls }) => {
    const response = await handleAdminAiReply(req('/admin/ai-reply', { contact_id: ID, prompt: 'Write a reply' }), env);
    assert.equal(response.status, 422);
    assert.equal((await response.json()).needs_settings, true);
    assert.equal(calls.some(c => c.url.includes('api.openai.com')), false);
  });
});

test('provider errors cannot leak keys and incomplete replies are not used', async () => {
  await fixture({ providerError: 401 }, async ({ env }) => {
    const response = await handleAdminAiReply(req('/admin/ai-reply', { contact_id: ID, prompt: 'Write a reply' }), env);
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /sk-synthetic/);
  });
  await fixture({ output: { status: 'incomplete', output: [{ type: 'message', content: [{ type: 'output_text', text: 'Partial text' }] }] } }, async ({ env }) => {
    const response = await handleAdminAiReply(req('/admin/ai-reply', { contact_id: ID, prompt: 'Write a reply' }), env);
    assert.equal(response.status, 502);
    assert.equal((await response.json()).reply, undefined);
  });
});

test('blank key preserves saved key, while malformed settings are rejected', async () => {
  await fixture({}, async ({ env, calls, config }) => {
    const response = await handleAdminAiSettings(req('/admin/ai-settings', { api_key: '', model: 'gpt-4.1-mini', enabled: false }), env);
    assert.equal(response.status, 200);
    assert.equal(config.api_key, KEY);
    assert.equal(calls.find(c => c.url.endsWith('/save_openai_reply_config')).body.p_api_key, null);
    assert.equal((await handleAdminAiSettings(req('/admin/ai-settings', { api_key: 'invalid key', model: 'gpt-5-mini', enabled: true }), env)).status, 422);
  });
});

test('a failed readback does not incorrectly claim that the stored key was lost', async () => {
  await fixture({ readbackFailure: true }, async ({ env, config }) => {
    const response = await handleAdminAiSettings(req('/admin/ai-settings', { api_key: KEY, model: 'gpt-5-mini', enabled: true }), env);
    assert.equal(response.status, 503);
    const result = await response.json();
    assert.match(result.error, /save was accepted/);
    assert.match(result.error, /Recheck saved status/);
    assert.equal(config.api_key, KEY);
    assert.doesNotMatch(JSON.stringify(result), /sk-synthetic/);
  });
});

 test('model listing is admin-only, includes all account model IDs, and never exposes credentials', async () => {
  await fixture({}, async ({ env, calls }) => {
    assert.equal((await handleAdminAiModels(req('/admin/ai-models', undefined, { signed: false }), env)).status, 401);
    assert.equal(calls.length, 0);
    const response = await handleAdminAiModels(req('/admin/ai-models'), env);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json();
    assert.deepEqual(body.models, ['gpt-test-text', 'image-test']);
    assert.doesNotMatch(JSON.stringify(body), /sk-synthetic/);
  });
  await fixture({ providerError: 401 }, async ({ env }) => {
    const response = await handleAdminAiModels(req('/admin/ai-models'), env);
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /sk-synthetic/);
  });
});
