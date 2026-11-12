/**
 * Static server for the built site.
 *
 * Dependency-free so the deploy image stays small and the build cannot fail
 * on an extra install. Serves `dist/`, maps extensionless paths to their
 * `.html` file, and falls back to `index.html` for unknown routes.
 */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', ...SECURITY });
    return res.end('Method Not Allowed');
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
