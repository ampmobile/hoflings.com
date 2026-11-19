/**
 * Prerenders the public pages into their HTML shells.
 *
 * Until now the site shipped an empty `<div id="root"></div>` and let React
 * fill it in the browser. A crawler that does not run JavaScript saw an empty
 * document, and even the crawlers that do run it had to wait for the bundle,
 * the network round trip and the hydration to finish before a word of copy
 * existed. The homepage happened to get indexed, but the other eight pages —
 * /hrbridge among them — were a rendering request away from being indexed.
 *
 * So the copy is now rendered at build time. This script builds the
 * server-side bundle of the same components, renders each public route with
 * react-dom/server, and writes the markup into the shell. The browser then
 * hydrates that markup instead of re-rendering it from an empty root, so
 * there is no flash and no second copy of the content to keep in sync.
 *
 * The console pages (/auth, /admin) are not prerendered: they are noindex,
 * they need a session, and their content is a signed-in inbox.
 */
import { build } from 'vite';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(ROOT, 'dist');

/** Shells that stay client-rendered. */
const CLIENT_ONLY = new Set(['auth', 'admin']);

const EMPTY_ROOT = '<div id="root"></div>';

/**
 * Shown when scripting is off. The copy above it is the real page, so this
 * only needs to say what is missing and where to reach the team.
 */
const NOSCRIPT = `<noscript>
<div style="max-width:46rem;margin:0 auto;padding:2.25rem 1.25rem;border-top:1px solid #1B2434;color:#C8D2E4;font:400 16px/1.65 system-ui,-apple-system,'Segoe UI',sans-serif">
<p style="margin:0 0 .5rem;color:#FFB41F;font-weight:700">JavaScript is switched off.</p>
<p style="margin:0">Everything above is the full page. The interactive parts — the contact form, the credential ledger and the animated dispatch view — need JavaScript. Reach the team at <a href="mailto:support@hoflings.com" style="color:#3BE8B0">support@hoflings.com</a>.</p>
</div>
</noscript>`;

// 1. Build the server bundle.
await build({ configFile: resolve(ROOT, 'vite.ssr.config.js') });

// 2. Load it. The file name is pinned in vite.ssr.config.js.
const { render } = await import(
  pathToFileURL(resolve(ROOT, '.ssr-build/entry-server.js')).href
);

// 3. Render each public shell.
const shells = (await readdir(DIST)).filter(
  (f) => f.endsWith('.html') && !CLIENT_ONLY.has(basename(f, '.html'))
);

let total = 0;

for (const file of shells) {
  const slug = basename(file, '.html');
  const path = resolve(DIST, file);
  const shell = await readFile(path, 'utf8');

  const page = (shell.match(/<body[^>]*\sdata-page="([^"]+)"/) || [])[1];
  if (!page) throw new Error(`${file}: no data-page attribute on <body>`);

  const markup = render(page);
  if (!markup || markup.length < 500) {
    throw new Error(`${file}: prerender produced ${markup.length} characters — refusing to ship it`);
  }

  if (!shell.includes(EMPTY_ROOT)) {
    throw new Error(`${file}: expected an empty ${EMPTY_ROOT} to replace`);
  }

  let next = shell.replace(EMPTY_ROOT, `<div id="root">${markup}</div>`);

  if (!next.includes('<noscript>')) {
    next = next.replace('</body>', `${NOSCRIPT}\n</body>`);
  }

  await writeFile(path, next, 'utf8');

  const bytes = Buffer.byteLength(next, 'utf8');
  total += bytes;
  console.log(
    `prerender: ${slug.padEnd(10)} page=${page.padEnd(10)} markup=${String(markup.length).padStart(6)} chars  shell=${bytes} bytes`
  );
}

console.log(
  `prerender: ${shells.length} pages rendered, ${total} bytes of HTML across all shells`
);
