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
 * are not in the sitemap.
 *
 * `lastmod` is derived from git, per page. It is the date of the most recent
 * commit that touched that page's shell, its React component, or the shared
 * components and data it renders from. Hardcoding the dates rotted on every
 * copy edit; deriving them cannot rot, because the number comes from the
 * commit that made the change. A page with uncommitted changes — a copy edit
 * in a working tree — is dated today, so the sitemap is never older than the
 * content it describes.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://hoflings.com';

/** The files whose changes affect a given page. */
const SHARED = [
  'src/App.jsx',
  'src/main.jsx',
  'src/components',
  'src/data',
  'src/lib',
  'src/styles',
];

const PAGES = [
  { path: '/', shell: 'index.html', source: 'src/pages/Home.jsx', changefreq: 'weekly', priority: '1.0' },
  { path: '/hrbridge', shell: 'hrbridge.html', source: 'src/pages/HrBridge.jsx', changefreq: 'weekly', priority: '0.9' },
  { path: '/services', shell: 'services.html', source: 'src/pages/Services.jsx', changefreq: 'monthly', priority: '0.8' },
  { path: '/platform', shell: 'platform.html', source: 'src/pages/Platform.jsx', changefreq: 'monthly', priority: '0.8' },
  { path: '/industries', shell: 'industries.html', source: 'src/pages/Industries.jsx', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', shell: 'contact.html', source: 'src/pages/Contact.jsx', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', shell: 'about.html', source: 'src/pages/About.jsx', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy', shell: 'privacy.html', source: 'src/pages/Privacy.jsx', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', shell: 'terms.html', source: 'src/pages/Terms.jsx', changefreq: 'yearly', priority: '0.3' },
];

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const git = (args) => {
  const res = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  if (res.status !== 0) return null;
  return res.stdout || '';
};

const TODAY = new Date().toISOString().slice(0, 10);

/** The date of the most recent commit touching any of `paths`. */
function lastCommit(paths) {
  const out = git(['log', '-1', '--format=%cs', '--', ...paths]);
  if (out === null) return null;
  const date = out.trim().split('\n').filter(Boolean).pop();
  return date || null;
}

/** True when any of `paths` has changes that are not committed yet. */
function isDirty(paths) {
  const out = git(['status', '--porcelain', '--', ...paths]);
  if (out === null) return false;
  return out.trim().length > 0;
}

const HEAD_DATE = lastCommit(['HEAD']) || TODAY;
const shallow = git(['rev-parse', '--is-shallow-repository']);
const isShallow = shallow === null ? false : shallow.trim() === 'true';

const urls = PAGES.map((page) => {
  const paths = [page.shell, page.source, ...SHARED];
  const committed = lastCommit(paths);
  const dirty = isDirty(paths);

  // An uncommitted edit has no commit to date it from, and a shallow clone
  // cannot see the history, so both fall back to a date that is never older
  // than the content itself.
  const lastmod = dirty || !committed ? TODAY : committed;

  console.log(
    `sitemap: ${page.path.padEnd(11)} lastmod=${lastmod}` +
      (dirty ? '  (uncommitted changes — dated today)' : '') +
      (!committed && !dirty ? '  (no history for these paths — dated today)' : '')
  );

  const loc = `${ORIGIN}${page.path}`;
  return [
    '  <url>',
    `    <loc>${esc(loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${page.changefreq}</changefreq>`,
    `    <priority>${page.priority}</priority>`,
    '  </url>',
  ].join('\n');
}).join('\n');

if (isShallow) {
  console.log(
    'sitemap: warning — this is a shallow clone, so per-page history is incomplete; dates fall back to the latest commit'
  );
}

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
