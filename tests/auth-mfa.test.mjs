import test from 'node:test';
import assert from 'node:assert/strict';
import { handleAuthMfa } from '../functions/_shared/mfa.js';
import { handleAuthLogin, handleAuthSession, requireAdmin, notifyRecipients } from '../functions/_shared/core.js';
const ID = '93a8aa87-ae5d-48f2-95a5-8e8af0174519';
const jwt = aal => `eyJhbGciOiJ0ZXN0In0.${Buffer.from(JSON.stringify({ aal })).toString('base64url')}.synthetic`;
let sequence = 0;
const request = (body, { aal = 'aal1', signed = true, origin = 'https://hoflings.com', path = '/auth/mfa' } = {}) => new Request(`https://hoflings.com${path}`, {
  method: body ? 'POST' : 'GET', headers: { origin, ...(signed ? { cookie: `hof_admin=${jwt(aal)}` } : {}) },
  ...(body ? { body: JSON.stringify(body) } : {}),
});
async function fixture(options, run) {
  const original = globalThis.fetch;
  const email = `mfa-${sequence++}@example.invalid`;
  const env = { SUPABASE_URL: 'https://database.example.invalid', SUPABASE_ANON_KEY: 'test', ADMIN_EMAIL: email };
  const calls = [];
  const factors = options?.factors || [{ id: ID, factor_type: 'totp', status: 'verified' }];
  globalThis.fetch = async (target, init = {}) => {
    const path = new URL(target).pathname;
    const body = init.body ? JSON.parse(init.body) : null;
    calls.push({ path, init, body });
    if (path === '/auth/v1/user') return options?.invalidSession ? Response.json({}, { status: 401 }) : Response.json({ id: 'test-user', email, factors });
    if (path === '/auth/v1/token') return Response.json({ access_token: jwt('aal1'), expires_in: 3600, user: { email } });
    if (path === '/auth/v1/factors' && init.method === 'POST') return Response.json({ id: ID, totp: { secret: 'SYNTHETICSETUPSECRET', qr_code: '<svg></svg>' } });
    if (path.endsWith('/challenge')) return Response.json({ id: 'synthetic-challenge' });
    if (path.endsWith('/verify')) return options?.invalidCode ? Response.json({}, { status: 422 }) : Response.json({ access_token: jwt(options?.upgradedAal || 'aal2'), refresh_token: 'must-not-return', expires_in: 3600 });
    if (path.startsWith('/auth/v1/factors/') && init.method === 'DELETE') return Response.json({});
    throw new Error('Unexpected request');
  };
  try { await run({ env, calls }); } finally { globalThis.fetch = original; }
}

test('password sign-in creates a short pre-MFA session without exposing tokens', async () => {
  await fixture({}, async ({ env }) => {
    const res = await handleAuthLogin(request({ email: env.ADMIN_EMAIL, password: 'synthetic-password' }, { path: '/auth/login' }), env);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('set-cookie'), /Max-Age=600/);
    assert.match(res.headers.get('set-cookie'), /HttpOnly/);
    const body = await res.json();
    assert.equal(body.mfa_required, true);
    assert.equal(body.access_token, undefined);
  });
});
test('all admin APIs reject password-only and invalid sessions; AAL2 is accepted only after server validation', async () => {
  await fixture({}, async ({ env }) => {
    assert.equal(await requireAdmin(env, request()), null);
    assert.equal((await (await handleAuthSession(request(), env)).json()).authenticated, false);
    assert.equal((await (await handleAuthSession(request(), env)).json()).mfa_required, true);
    assert.equal((await requireAdmin(env, request(undefined, { aal: 'aal2' }))).email, env.ADMIN_EMAIL);
  });
  await fixture({ invalidSession: true }, async ({ env }) => {
    assert.equal(await requireAdmin(env, request(undefined, { aal: 'aal2' })), null);
  });
});
test('MFA requires a valid password session and rejects cross-site writes before enrollment', async () => {
  await fixture({}, async ({ env, calls }) => {
    assert.equal((await handleAuthMfa(request(undefined, { signed: false }), env)).status, 401);
    assert.equal((await handleAuthMfa(request({ action: 'enroll' }, { origin: 'https://other.invalid' }), env)).status, 403);
    assert.equal(calls.length, 0);
    const status = await handleAuthMfa(request(), env);
    assert.equal(status.headers.get('cache-control'), 'no-store');
    const body = await status.json();
    assert.equal(body.enrolled, true);
    assert.equal(body.secret, undefined);
    assert.equal((await handleAuthMfa(request({ action: 'enroll' }), env)).status, 409);
  });
});
test('enrollment restarts abandoned unverified factors, never removes verified factors, and is not cached', async () => {
  await fixture({ factors: [{ id: ID, status: 'unverified', factor_type: 'totp' }] }, async ({ env, calls }) => {
    const res = await handleAuthMfa(request({ action: 'enroll' }), env);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.equal((await res.json()).secret, 'SYNTHETICSETUPSECRET');
    assert.equal(calls.filter(c => c.init.method === 'DELETE').length, 1);
    assert.equal(calls.find(c => c.path === '/auth/v1/factors').body.issuer, 'Hoflings');
  });
});
test('verification checks ownership and six-digit code before challenge and upgrades the HTTP-only session', async () => {
  await fixture({}, async ({ env, calls }) => {
    assert.equal((await handleAuthMfa(request({ action: 'verify', factor_id: ID, code: '123' }), env)).status, 422);
    assert.equal((await handleAuthMfa(request({ action: 'verify', factor_id: '03a8aa87-ae5d-48f2-95a5-8e8af0174519', code: '123456' }), env)).status, 403);
    assert.equal(calls.some(c => c.path.endsWith('/challenge')), false);
    const res = await handleAuthMfa(request({ action: 'verify', factor_id: ID, code: '123456' }), env);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('set-cookie'), /HttpOnly; Secure; Max-Age=3600/);
    assert.deepEqual(await res.json(), { ok: true });
    assert.deepEqual(calls.find(c => c.path.endsWith('/verify')).body, { challenge_id: 'synthetic-challenge', code: '123456' });
  });
});
test('invalid or non-upgrading verification never creates an admin cookie', async () => {
  for (const options of [{ invalidCode: true }, { upgradedAal: 'aal1' }]) await fixture(options, async ({ env }) => {
    const res = await handleAuthMfa(request({ action: 'verify', factor_id: ID, code: '123456' }), env);
    assert.ok(res.status >= 400);
    assert.equal(res.headers.get('set-cookie'), null);
  });
});
test('support receives inquiry copies once while preserving existing recipients', () => {
  assert.deepEqual(notifyRecipients({ CONTACT_TO_EMAIL: 'owner@example.com,SUPPORT@HOFLINGS.COM,support@hoflings.com' }), ['owner@example.com', 'support@hoflings.com']);
  assert.deepEqual(notifyRecipients({ ADMIN_EMAIL: 'owner@example.com' }), ['owner@example.com', 'support@hoflings.com']);
  assert.deepEqual(notifyRecipients({}), ['support@hoflings.com']);
});
