/**
 * Shared API core for hoflings.com.
 *
 * Written as plain, dependency-free ESM against the Web Fetch API so the same
 * code runs in two places:
 *   - Cloudflare Pages Functions (`functions/**`) — Deno/Workers runtime
 *   - The Node host (`server.js`) — Node 22 static+API server
 *
 * Both hosts pass an `env` bag of configuration:
 *   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
 *   SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, SENDGRID_FROM_NAME,
 *   ADMIN_EMAIL, CONTACT_TO_EMAIL, PUBLIC_SITE_URL
 */

export const SESSION_COOKIE = 'hof_admin';
export const CONTACT_TABLE = 'contacts';

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };

/* ------------------------------- helpers ------------------------------- */

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

export function parseCookies(request) {
  const out = {};
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const key = part.slice(0, i).trim();
    if (!key) continue;
    try {
      out[key] = decodeURIComponent(part.slice(i + 1).trim());
    } catch {
      out[key] = part.slice(i + 1).trim();
    }
  }
  return out;
}

export function isHttps(request) {
  try {
    return new URL(request.url).protocol === 'https:';
  } catch {
    return true;
  }
}

export function cookieHeader(name, value, { maxAge, secure = true, httpOnly = true, sameSite = 'Lax', path = '/' } = {}) {
  const bits = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, `SameSite=${sameSite}`];
  if (httpOnly) bits.push('HttpOnly');
  if (secure) bits.push('Secure');
  if (typeof maxAge === 'number') bits.push(`Max-Age=${maxAge}`);
  return bits.join('; ');
}

/**
 * ADMIN_EMAIL may hold a comma-separated list of administrator addresses.
 * A list means one mistyped or browser-autofilled address can never lock the
 * owner out of their own console.
 */
export function adminEmails(env) {
  return String((env && env.ADMIN_EMAIL) || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/** True when the address is on the administrator allow-list. */
export function isAdminEmail(env, email) {
  const list = adminEmails(env);
  if (!list.length) return true; // no list configured: any account may sign in
  return list.includes(String(email || '').trim().toLowerCase());
}

/** Recipients for site notifications (CONTACT_TO_EMAIL, else the admins). */
export function notifyRecipients(env) {
  const to = String((env && env.CONTACT_TO_EMAIL) || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return to.length ? to : adminEmails(env);
}

export async function readJson(request) {
  try {
    const text = await request.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function clientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'local'
  );
}

/** In-memory throttle. Good enough for a single-site contact form. */
const hits = new Map();
export function rateLimit(key, { limit = 5, windowMs = 10 * 60 * 1000 } = {}) {
  const now = Date.now();
  const seen = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (seen.length >= limit) return false;
  seen.push(now);
  hits.set(key, seen);
  if (hits.size > 5000) hits.clear();
  return true;
}

/* ------------------------------ supabase ------------------------------- */

function supabaseUrl(env) {
  return String(env.SUPABASE_URL || '').replace(/\/+$/, '');
}

async function sb(env, path, { method = 'GET', body, token, service = false, headers = {} } = {}) {
  const key = service ? env.SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_ANON_KEY;
  if (!key || !supabaseUrl(env)) {
    return { ok: false, status: 500, data: { message: 'Supabase is not configured on this host.' } };
  }
  const h = {
    apikey: key,
    authorization: `Bearer ${token || key}`,
    ...headers,
  };
  if (body !== undefined) h['content-type'] = 'application/json';

  const res = await fetch(`${supabaseUrl(env)}${path}`, {
    method,
    headers: h,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

export { sb as supabase };

/* ------------------------------- contacts ------------------------------- */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export function validateContact(input) {
  const src = input && typeof input === 'object' ? input : {};
  const field = (v, max) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, max) : '');

  const value = {
    name: field(src.name, 120),
    email: field(src.email, 200).toLowerCase(),
    company: field(src.company, 160),
    phone: field(src.phone, 60),
    role: field(src.role, 120),
    region: field(src.region, 120),
    fleet: field(src.fleet, 120),
    message: typeof src.message === 'string' ? src.message.trim().slice(0, 4000) : '',
    source: field(src.source, 200),
  };

  const errors = {};
  if (!value.name) errors.name = 'Tell us your name.';
  if (!EMAIL_RE.test(value.email)) errors.email = 'Enter a valid work email.';
  if (!value.company) errors.company = 'Tell us the company.';
  if (value.message.length < 10) errors.message = 'Add a little more detail so we can help.';

  return { ok: Object.keys(errors).length === 0, value, errors };
}

export async function insertContact(env, contact, request) {
  const row = {
    ...contact,
    user_agent: (request?.headers?.get('user-agent') || '').slice(0, 300),
  };
  const res = await sb(env, `/rest/v1/${CONTACT_TABLE}`, {
    method: 'POST',
    body: row,
    service: true,
    headers: { Prefer: 'return=representation' },
  });
  if (!res.ok) {
    return { ok: false, error: res.data?.message || `insert failed (${res.status})` };
  }
  return { ok: true, row: Array.isArray(res.data) ? res.data[0] : res.data };
}

export async function listContacts(env) {
  const res = await sb(
    env,
    `/rest/v1/${CONTACT_TABLE}?select=*&order=created_at.desc&limit=500`,
    { service: true }
  );
  if (!res.ok) return { ok: false, error: res.data?.message || `query failed (${res.status})` };
  return { ok: true, contacts: Array.isArray(res.data) ? res.data : [] };
}

export async function updateContact(env, id, patch) {
  const res = await sb(env, `/rest/v1/${CONTACT_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: patch,
    service: true,
  });
  if (!res.ok) return { ok: false, error: res.data?.message || `update failed (${res.status})` };
  return { ok: true };
}

export async function deleteContact(env, id) {
  const res = await sb(env, `/rest/v1/${CONTACT_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    service: true,
  });
  if (!res.ok) return { ok: false, error: res.data?.message || `delete failed (${res.status})` };
  return { ok: true };
}

/* -------------------------------- sendgrid ------------------------------ */

export async function sendMail(env, { to, subject, text, html }) {
  if (!env.SENDGRID_API_KEY) {
    return { ok: false, error: 'SENDGRID_API_KEY is not configured on this host.' };
  }
  const recipients = (Array.isArray(to) ? to : [to])
    .map((v) => String(v || '').trim())
    .filter(Boolean);
  if (!recipients.length) return { ok: false, error: 'No recipient.' };

  const fromEmail = env.SENDGRID_FROM_EMAIL || 'support@hoflings.com';
  const fromName = env.SENDGRID_FROM_NAME || 'Hoflings';

  const payload = {
    personalizations: [{ to: recipients.map((email) => ({ email })), subject }],
    from: { email: fromEmail, name: fromName },
    reply_to: { email: env.CONTACT_REPLY_TO || fromEmail },
    content: [{ type: 'text/plain', value: text }],
  };
  if (html) payload.content.push({ type: 'text/html', value: html });

  let res;
  try {
    res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return { ok: false, error: `SendGrid request failed: ${err?.message || err}` };
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return { ok: false, error: `SendGrid ${res.status}: ${detail.slice(0, 300)}` };
  }
  return { ok: true };
}

function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

const row = (label, value) =>
  `<tr><td style="padding:6px 14px 6px 0;color:#7b8494;font:12px/1.5 ui-monospace,monospace;white-space:nowrap">${esc(
    label
  )}</td><td style="padding:6px 0;color:#0b0e14;font:14px/1.5 -apple-system,Segoe UI,sans-serif">${esc(
    value || '—'
  )}</td></tr>`;

/** Notify the site owner about a new lead, and acknowledge the visitor. */
export async function notifyNewContact(env, contact) {
  const to = notifyRecipients(env);
  const stamp = new Date().toUTCString();

  const text = [
    `New enquiry — ${contact.company}`,
    '',
    `Name:    ${contact.name}`,
    `Email:   ${contact.email}`,
    `Company: ${contact.company}`,
    `Phone:   ${contact.phone || '—'}`,
    `Role:    ${contact.role || '—'}`,
    `Region:  ${contact.region || '—'}`,
    `Fleet:   ${contact.fleet || '—'}`,
    `Source:  ${contact.source || 'hoflings.com'}`,
    '',
    'Message:',
    contact.message,
    '',
    `Received: ${stamp}`,
  ].join('\n');

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f6f8">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e3e6ea;border-radius:10px">
<tr><td style="padding:22px 24px 8px">
<p style="margin:0 0 4px;color:#b8791a;font:12px/1.4 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase">Hoflings · New enquiry</p>
<h1 style="margin:0;font:600 20px/1.3 -apple-system,Segoe UI,sans-serif;color:#0b0e14">${esc(contact.company)}</h1>
</td></tr>
<tr><td style="padding:8px 24px 18px">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">
${row('Name', contact.name)}
${row('Email', contact.email)}
${row('Company', contact.company)}
${row('Phone', contact.phone)}
${row('Role', contact.role)}
${row('Region', contact.region)}
${row('Fleet', contact.fleet)}
</table>
</td></tr>
<tr><td style="padding:0 24px 18px">
<p style="margin:0 0 8px;color:#7b8494;font:12px/1.5 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase">Message</p>
<p style="margin:0;padding:14px 16px;background:#f7f8fa;border-left:3px solid #FFB41F;border-radius:0 8px 8px 0;color:#141821;font:14px/1.6 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${esc(
    contact.message
  )}</p>
</td></tr>
<tr><td style="padding:0 24px 22px;color:#7b8494;font:12px/1.5 -apple-system,Segoe UI,sans-serif">Reply directly to ${esc(
    contact.email
  )} · received ${esc(stamp)}</td></tr></table></body></html>`;

  const admin = await sendMail(env, {
    to,
    subject: `New Hoflings enquiry — ${contact.company}`,
    text,
    html,
  });

  const reply = await sendMail(env, {
    to: contact.email,
    subject: 'We received your Hoflings enquiry',
    text: [
      `Hi ${contact.name},`,
      '',
      `Thanks for contacting Hoflings about ${contact.company}. Your enquiry is with our team and a recruiter will come back to you at ${contact.email} within 48 hours.`,
      '',
      'For reference, this is what you sent us:',
      '',
      contact.message,
      '',
      'Hoflings Ltd',
      '300 Main Street, Madison, NJ 07940',
      'support@hoflings.com',
    ].join('\n'),
    html: `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f6f8">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e3e6ea;border-radius:10px">
<tr><td style="padding:22px 24px 8px">
<p style="margin:0 0 4px;color:#b8791a;font:12px/1.4 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase">Hoflings</p>
<h1 style="margin:0;font:600 20px/1.3 -apple-system,Segoe UI,sans-serif;color:#0b0e14">We received your enquiry</h1>
</td></tr>
<tr><td style="padding:8px 24px 18px;color:#3b4252;font:14px/1.65 -apple-system,Segoe UI,sans-serif">
<p style="margin:0 0 12px">Hi ${esc(contact.name)},</p>
<p style="margin:0 0 12px">Thanks for contacting Hoflings about ${esc(
      contact.company
    )}. Your enquiry is with our team and a recruiter will come back to you at ${esc(
      contact.email
    )} within 48 hours.</p>
<p style="margin:0 0 12px;color:#7b8494;font:12px/1.5 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase">What you sent us</p>
<p style="margin:0 0 18px;padding:14px 16px;background:#f7f8fa;border-left:3px solid #FFB41F;border-radius:0 8px 8px 0;color:#141821;font:14px/1.6 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${esc(
      contact.message
    )}</p>
<p style="margin:0;color:#7b8494;font:13px/1.6 -apple-system,Segoe UI,sans-serif">Hoflings Ltd · 300 Main Street, Madison, NJ 07940 · support@hoflings.com</p>
</td></tr></table></body></html>`,
  });

  return { admin, reply };
}

/* --------------------------------- auth --------------------------------- */

export async function getSessionUser(env, request) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return null;
  const res = await sb(env, '/auth/v1/user', { token });
  if (!res.ok || !res.data || !res.data.email) return null;
  return res.data;
}

export async function requireAdmin(env, request) {
  const user = await getSessionUser(env, request);
  if (!user) return null;
  if (!isAdminEmail(env, user.email)) return null;
  return user;
}

/* ------------------------------- handlers ------------------------------- */

export async function handleContactCreate(request, env) {
  if (request.method === 'OPTIONS') {
    return json({}, 204, { allow: 'POST, OPTIONS' });
  }
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405, { allow: 'POST' });
  }

  if (!rateLimit(clientIp(request))) {
    return json({ error: 'Too many submissions from this connection. Please try again shortly.' }, 429);
  }

  const body = await readJson(request);

  // Honeypot: real people never fill this in.
  if (body && (body.website || body.fax)) {
    return json({ ok: true });
  }

  const { ok, value, errors } = validateContact(body);
  if (!ok) {
    return json({ error: 'Please check the highlighted fields.', fields: errors }, 422);
  }

  const inserted = await insertContact(env, value, request);
  if (!inserted.ok) {
    console.error('contact insert failed:', inserted.error);
    return json(
      { error: 'We could not save that. Please email support@hoflings.com and we will pick it up.' },
      500
    );
  }

  const mail = await notifyNewContact(env, value);
  if (!mail.admin.ok) console.error('admin notification failed:', mail.admin.error);
  if (!mail.reply.ok) console.error('visitor auto-reply failed:', mail.reply.error);

  if (inserted.row?.id && mail.admin.ok) {
    await updateContact(env, inserted.row.id, { notified: true, notified_at: new Date().toISOString() });
  }

  return json({ ok: true, id: inserted.row?.id || null, notified: mail.admin.ok });
}

export async function handleAuthLogin(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { allow: 'POST' });
  const body = await readJson(request);
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');
  const admin = adminEmails(env);

  if (!email || !password) return json({ error: 'Email and password are both required.' }, 422);
  if (admin.length && !admin.includes(email)) {
    return json({ error: 'That is not the administrator address for this console. Check the address and try again.' }, 403);
  }

  const res = await sb(env, '/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password },
  });
  if (!res.ok) {
    return json({ error: 'That email and password did not work.' }, 401);
  }

  const { access_token, expires_in, user } = res.data || {};
  const headers = {
    'set-cookie': cookieHeader(SESSION_COOKIE, access_token, {
      maxAge: Number(expires_in) || 3600,
      secure: isHttps(request),
    }),
  };
  return json({ ok: true, email: user?.email || email }, 200, headers);
}

export async function handleAuthSignup(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { allow: 'POST' });
  const body = await readJson(request);
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');
  const admin = adminEmails(env);

  if (!email || !password) return json({ error: 'Email and password are both required.' }, 422);
  if (admin.length && !admin.includes(email)) {
    return json({ error: 'That is not the administrator address for this console. Check the address and try again.' }, 403);
  }
  if (password.length < 10) {
    return json({ error: 'Use a password of at least 10 characters.' }, 422);
  }

  // The public signup endpoint sends a confirmation email, which burns the
  // project's email rate limit and leaves the user unconfirmed. The admin API
  // creates the account already confirmed and without sending any mail.
  const res = await sb(env, '/auth/v1/admin/users', {
    method: 'POST',
    body: { email, password, email_confirm: true },
    service: true,
  });
  if (!res.ok) {
    const msg = String(res.data?.msg || res.data?.message || res.data?.error_description || '');
    if (/already|registered|exists/i.test(msg)) {
      return json({ error: 'That account already exists — sign in instead.' }, 409);
    }
    return json({ error: `Could not create the account: ${msg || res.status}` }, 400);
  }

  const login = await sb(env, '/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: { email, password },
  });
  const { access_token, expires_in } = login.data || {};
  if (!access_token) {
    const msg = String(login.data?.msg || login.data?.message || login.data?.error_description || '');
    return json({ error: `Account created but sign-in failed: ${msg || login.status}` }, 502);
  }
  const headers = {
    'set-cookie': cookieHeader(SESSION_COOKIE, access_token, {
      maxAge: Number(expires_in) || 3600,
      secure: isHttps(request),
    }),
  };
  return json({ ok: true, email }, 200, headers);
}

export async function handleAuthLogout(request, env) {
  const headers = {
    'set-cookie': cookieHeader(SESSION_COOKIE, '', { maxAge: 0, secure: isHttps(request) }),
  };
  return json({ ok: true }, 200, headers);
}

export async function handleAuthSession(request, env) {
  const user = await getSessionUser(env, request);
  if (!user) return json({ authenticated: false }, 200);
  return json({ authenticated: true, email: user.email }, 200);
}

export async function handleAuthForgot(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { allow: 'POST' });
  const body = await readJson(request);
  const email = String(body?.email || '').trim().toLowerCase();
  const admin = adminEmails(env);

  if (!email) return json({ error: 'Enter your email address.' }, 422);
  if (admin.length && !admin.includes(email)) {
    return json({ error: 'That is not the administrator address for this console. Check the address and try again.' }, 403);
  }

  const site = String(env.PUBLIC_SITE_URL || '').replace(/\/+$/, '');
  const path = site ? `/auth/v1/recover?redirect_to=${encodeURIComponent(`${site}/auth`)}` : '/auth/v1/recover';
  const res = await sb(env, path, { method: 'POST', body: { email } });

  if (!res.ok) {
    console.error('password recovery failed:', res.status, JSON.stringify(res.data));
    return json({ error: 'Could not start the password reset. Try again shortly.' }, 502);
  }
  return json({ ok: true });
}

export async function handleAuthReset(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { allow: 'POST' });
  const body = await readJson(request);
  const token = String(body?.access_token || '');
  const password = String(body?.password || '');

  if (!token) return json({ error: 'Missing recovery token. Request a fresh reset link.' }, 422);
  if (password.length < 10) return json({ error: 'Use a password of at least 10 characters.' }, 422);

  const res = await sb(env, '/auth/v1/user', {
    method: 'PUT',
    body: { password },
    token,
  });
  if (!res.ok) {
    return json({ error: 'Could not update the password — the link may have expired.' }, 400);
  }
  return json({ ok: true });
}

const CONTACT_STATUSES = ['new', 'contacted', 'archived'];

export async function handleAdminContacts(request, env) {
  const user = await requireAdmin(env, request);
  if (!user) return json({ error: 'Not signed in.' }, 401);

  if (request.method === 'GET') {
    const res = await listContacts(env);
    if (!res.ok) {
      console.error('contact list failed:', res.error);
      return json({ error: 'Could not load the inbox.' }, 500);
    }
    return json({ contacts: res.contacts, admin: user.email });
  }

  if (request.method === 'PATCH' || request.method === 'POST') {
    const body = await readJson(request);
    const id = String(body?.id || '');
    if (!id) return json({ error: 'Missing contact id.' }, 422);

    const patch = {};
    if (body.status !== undefined) {
      if (!CONTACT_STATUSES.includes(body.status)) {
        return json({ error: 'Unknown status.' }, 422);
      }
      patch.status = body.status;
    }
    if (body.note !== undefined) patch.note = String(body.note).slice(0, 4000);
    if (!Object.keys(patch).length) return json({ error: 'Nothing to update.' }, 422);

    const res = await updateContact(env, id, patch);
    if (!res.ok) return json({ error: 'Could not update that contact.' }, 500);
    return json({ ok: true });
  }

  if (request.method === 'DELETE') {
    const body = await readJson(request);
    const id = String(body?.id || '');
    if (!id) return json({ error: 'Missing contact id.' }, 422);
    const res = await deleteContact(env, id);
    if (!res.ok) return json({ error: 'Could not delete that contact.' }, 500);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed.' }, 405, { allow: 'GET, PATCH, DELETE' });
}
