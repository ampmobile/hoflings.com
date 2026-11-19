/**
 * Writes dist/sitemap.xml.
 *
 * The site is a multi-page Vite build: every page is its own HTML shell with
 * its own title, description and canonical. Cloudflare Pages serves the
 * extensionless form (`/hrbridge`), and `/hrbridge.html` 308-redirects to it,
 * so the sitemap lists the extensionless form — the same URL the canonical
 * tags point at.
 *
 * `/auth` and `/admin` are deliberately absent: they are marked noindex and
 * are disallowed in robots.txt.
 *
 * `lastmod` is the date the page's shell and component last changed. Bump it
 * when you edit the copy of a page.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://hoflings.com';

const PAGES = [
  { path: '/', lastmod: '2026-11-12', changefreq: 'weekly', priority: '1.0' },
  { path: '/hrbridge', lastmod: '2026-11-12', changefreq: 'weekly', priority: '0.9' },
  { path: '/services', lastmod: '2026-11-12', changefreq: 'monthly', priority: '0.8' },
  { path: '/platform', lastmod: '2026-11-12', changefreq: 'monthly', priority: '0.8' },
  { path: '/industries', lastmod: '2026-11-12', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', lastmod: '2026-11-12', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', lastmod: '2026-11-12', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy', lastmod: '2026-11-15', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', lastmod: '2026-11-12', changefreq: 'yearly', priority: '0.3' },
];

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const urls = PAGES.map((page) => {
  const loc = `${ORIGIN}${page.path}`;
  return [
    '  <url>',
    `    <loc>${esc(loc)}</loc>`,
    `    <lastmod>${page.lastmod}</lastmod>`,
    `    <changefreq>${page.changefreq}</changefreq>`,
    `    <priority>${page.priority}</priority>`,
    '  </url>',
  ].join('\n');
}).join('\n');

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  '</urlset>',
  '',
].join('\n');

const out = resolve(ROOT, 'dist/sitemap.xml');
await mkdir(dirname(out), { recursive: true });
await writeFile(out, xml, 'utf8');
console.log(`sitemap: wrote ${PAGES.length} urls to dist/sitemap.xml`);
