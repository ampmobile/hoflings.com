/**
 * Static server for the built site, plus the contact and admin API.
 *
 * Dependency-free so the deploy image stays small and the build cannot fail
 * on an extra install. Serves `dist/`, maps extensionless paths to their
 * `.html` file, and falls back to `index.html` for unknown routes.
 *
 * The API handlers are shared with the Cloudflare Pages Functions deployment
 * (see `functions/_shared/core.js`), so both hosts answer identically.
 */
import http from 'node:http';
import { handleAuthMfa } from './functions/_shared/mfa.js';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleAdminAiSettings, handleAdminAiReply, handleAdminAiModels } from './functions/_shared/ai.js';
import {
  handleContactCreate,
  handleRentalQuoteCreate,
  handleAuthLogin,
  handleAuthSignup,
  handleAuthLogout,
  handleAuthSession,
  handleAuthForgot,
  handleAuthReset,
  handleAdminContacts,
  handleAdminContactReply,
} from './functions/_shared/core.js';

const ROOT = resolve(fileURLToPath(new URL('./dist', import.meta.url)));
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

/** Resolve a URL path to a file inside ROOT, refusing to escape it. */
function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const normalized = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const full = join(ROOT, normalized);
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  return full;
}

async function exists(p) {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

async function resolveFile(urlPath) {
  let p = safePath(urlPath);
  if (!p) return null;

  if (await exists(p)) return p;

  // `/services` -> `/services.html`
  if (!extname(p)) {
    const withHtml = `${p}.html`;
    if (await exists(withHtml)) return withHtml;
    const withIndex = join(p, 'index.html');
    if (await exists(withIndex)) return withIndex;
  }

  // Unknown route -> the home page, so deep links never hard-fail.
  const index = join(ROOT, 'index.html');
  if (await exists(index)) return index;
  return null;
}

/* --------------------------------- API ---------------------------------- */

const API_ROUTES = {
  '/contacts': handleContactCreate,
  '/rental-quotes': handleRentalQuoteCreate,
  '/auth/mfa': handleAuthMfa,
  '/auth/login': handleAuthLogin,
  '/auth/signup': handleAuthSignup,
  '/auth/logout': handleAuthLogout,
  '/auth/session': handleAuthSession,
  '/auth/forgot': handleAuthForgot,
  '/auth/reset': handleAuthReset,
  '/admin/contacts': handleAdminContacts,
  '/admin/contact-replies': handleAdminContactReply,
  '/admin/ai-settings': handleAdminAiSettings,
  '/admin/ai-models': handleAdminAiModels,
  '/admin/ai-reply': handleAdminAiReply,
};

function apiHandler(pathname) {
  const handler = API_ROUTES[pathname];
  return handler || null;
}

/** Node request -> Web Request, so one handler can serve both hosts. */
async function toWebRequest(req) {
  const host = req.headers.host || 'localhost';
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  const url = new URL(req.url || '/', `${local ? 'http' : 'https'}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
    else headers.set(key, value);
  }

  const method = (req.method || 'GET').toUpperCase();
  let body;
  if (method !== 'GET' && method !== 'HEAD') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    body = Buffer.concat(chunks);
  }

  return new Request(url, { method, headers, body });
}

/** Web Response -> Node response. */
async function sendWebResponse(res, response) {
  const headers = {};
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === 'set-cookie') continue;
    headers[key] = value;
  }
  const cookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [];
  if (cookies.length) headers['set-cookie'] = cookies;

  const body = Buffer.from(await response.arrayBuffer());
  res.writeHead(response.status, { 'Content-Length': body.length, ...headers, ...SECURITY });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const pathname = (req.url || '/').split('?')[0];
  if (pathname === '/mac-studio' || pathname.startsWith('/mac-studio/')) {
    const source = new URL(req.url || '/', 'https://hoflings.com');
    const target = new URL('https://mac-studio.hoflings.com/');
    const path = source.pathname.slice('/mac-studio'.length) || '/';
    target.pathname = path === '/index.html' ? '/' : path;
    target.search = source.search;
    res.writeHead(301, { Location: target.href, ...SECURITY });
    return res.end();
  }

  const handler = apiHandler(pathname);
  if (handler) {
    try {
      const response = await handler(await toWebRequest(req), process.env);
      return await sendWebResponse(res, response);
    } catch (err) {
      console.error(`api ${pathname} failed:`, err);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY });
      return res.end(JSON.stringify({ error: 'Something went wrong on our side.' }));
    }
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', ...SECURITY });
    return res.end('Method Not Allowed');
  }

  // `/hrbridge.html` -> `/hrbridge`, matching Cloudflare Pages. One canonical
  // URL per page: the extensionless form is what the canonical tags and the
  // sitemap point at.
  if (pathname.endsWith('.html')) {
    const pretty = pathname.slice(0, -'.html'.length) || '/';
    res.writeHead(301, { Location: pretty, ...SECURITY });
    return res.end('Moved Permanently');
  }

  const file = await resolveFile(req.url || '/');
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY });
    return res.end('Not Found');
  }

  const ext = extname(file);
  const isHashed = /\/assets\//.test(file) && /-[A-Za-z0-9_-]{8,}\.[a-z0-9]+$/.test(file);

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': isHashed
        ? 'public, max-age=31536000, immutable'
        : ext === '.html'
          ? 'public, max-age=0, must-revalidate'
          : 'public, max-age=3600',
      ...SECURITY,
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`hoflings.com serving ${ROOT} on http://${HOST}:${PORT}`);
});
