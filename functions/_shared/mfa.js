import { json as responseJson, getSessionUser, isAdminEmail, parseCookies, SESSION_COOKIE, supabase, readJson, cookieHeader, isHttps, rateLimit, clientIp, sessionHasMfa } from './core.js';
const json = (body, status = 200, headers = {}) => responseJson(body, status, { 'cache-control': 'no-store', ...headers });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function handleAuthMfa(request, env) {
  try { return await mfa(request, env); }
  catch { return json({ error: 'Authenticator service is temporarily unavailable. Try again shortly.' }, 503); }
}
async function mfa(request, env) {
  if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
  if (request.method === 'POST' && ((request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site')) return json({ error: 'Continue from the Hoflings sign-in page.' }, 403);
  const user = await getSessionUser(env, request);
  if (!user || !isAdminEmail(env, user.email)) return json({ error: 'Sign in with your email and password first.' }, 401);
  const token = parseCookies(request)[SESSION_COOKIE];
  const factors = (Array.isArray(user.factors) ? user.factors : []).filter(f => f.factor_type === 'totp');
  const verified = factors.filter(f => f.status === 'verified');
  if (request.method === 'GET') return json({ ok: true, verified: sessionHasMfa(request), enrolled: verified.length > 0, factors: verified.map(f => ({ id: f.id, name: f.friendly_name || 'Google Authenticator' })) });
  if (!rateLimit(`mfa:${user.id || user.email}:${clientIp(request)}`, { limit: 12, windowMs: 60000 })) return json({ error: 'Too many attempts. Wait a minute and try again.' }, 429);
  const body = await readJson(request);
  if (body?.action === 'enroll') {
    if (verified.length) return json({ error: 'An authenticator is already enrolled. Enter its code to sign in.' }, 409);
    // Abandoned enrollments cannot be recovered: Supabase only reveals the secret once.
    for (const factor of factors.filter(f => f.status === 'unverified')) {
      const removed = await supabase(env, `/auth/v1/factors/${encodeURIComponent(factor.id)}`, { method: 'DELETE', token });
      if (!removed.ok) return json({ error: 'Could not restart authenticator setup. Please sign in again.' }, 503);
    }
    const result = await supabase(env, '/auth/v1/factors', { method: 'POST', token, body: { factor_type: 'totp', friendly_name: 'Hoflings Google Authenticator', issuer: 'Hoflings' } });
    if (!result.ok || !result.data?.totp?.secret || !result.data?.totp?.qr_code) return json({ error: 'Could not start authenticator setup. Please try again.' }, 503);
    return json({ ok: true, factor_id: result.data.id, qr_code: result.data.totp.qr_code, secret: result.data.totp.secret });
  }
  if (body?.action !== 'verify' || !UUID.test(body.factor_id || '') || !/^\d{6}$/.test(body.code || '')) return json({ error: 'Enter the six-digit code from Google Authenticator.' }, 422);
  if (!factors.some(f => f.id === body.factor_id)) return json({ error: 'That authenticator does not belong to this account. Restart setup.' }, 403);
  const path = `/auth/v1/factors/${encodeURIComponent(body.factor_id)}`;
  const challenge = await supabase(env, `${path}/challenge`, { method: 'POST', token, body: {} });
  if (!challenge.ok || !challenge.data?.id) return json({ error: 'Could not start verification. Wait briefly and try again.' }, 503);
  const verifiedResult = await supabase(env, `${path}/verify`, { method: 'POST', token, body: { challenge_id: challenge.data.id, code: body.code } });
  if (!verifiedResult.ok || !verifiedResult.data?.access_token) return json({ error: 'That code did not work or has expired. Use the current code in Google Authenticator.' }, 401);
  const data = verifiedResult.data;
  const upgraded = new Request(request.url, { headers: { cookie: `${SESSION_COOKIE}=${encodeURIComponent(data.access_token)}` } });
  if (!sessionHasMfa(upgraded)) return json({ error: 'Two-factor verification was not completed. Please sign in again.' }, 502);
  return json({ ok: true }, 200, { 'set-cookie': cookieHeader(SESSION_COOKIE, data.access_token, { maxAge: Number(data.expires_in) || 3600, secure: isHttps(request) }) });
}
