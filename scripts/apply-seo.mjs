/**
 * Rebuilds the <head> of every page shell from one table of record.
 *
 * The site is a multi-page Vite build: each page is its own HTML shell with
 * its own title, description, canonical and social tags. Keeping those by hand
 * across eleven files is how they drift, so they live here instead. Run this
 * after changing copy, then commit the shells it rewrites.
 *
 *     node scripts/apply-seo.mjs
 *
 * Every page gets:
 *   - a self-referencing absolute canonical
 *   - a robots meta tag (index, follow on public pages; noindex on the console)
 *   - a full Open Graph and Twitter card set including a 1200x630 image
 *   - JSON-LD (Organization, WebSite, WebPage, ImageObject, BreadcrumbList)
 *
 * The script refuses to write a title over 60 characters or a description
 * outside 140-160, because both get truncated in search results.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://hoflings.com';
const LEGAL = 'Hoflings Ltd';
const TAGLINE = 'Fully automated AI recruiting and onboarding for the freight economy';
const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: '300 Main Street',
  addressLocality: 'Madison',
  addressRegion: 'NJ',
  postalCode: '07940',
  addressCountry: 'US',
};

/** Public pages. `path` is the extensionless URL the site actually serves. */
const PAGES = [
  {
    slug: 'index',
    path: '/',
    crumb: 'Home',
    title: 'Hoflings — AI Recruiting & HR for Transportation',
    description:
      'Fully automated AI recruiting and onboarding for US and Canadian trucking, freight and delivery operators — from the first résumé to the qualification file.',
    imageAlt: 'Hoflings — AI recruiting and onboarding for the freight economy',
    extra: null,
  },
  {
    slug: 'services',
    path: '/services',
    crumb: 'Services',
    title: 'Recruiting, Onboarding & HR Services for Transportation',
    description:
      'Fully automated AI recruiting, onboarding and HR services for transportation employers — priced against unfilled trucks and compliance, not software seats.',
    imageAlt: 'Hoflings services — recruiting, onboarding and HR for transportation',
    extra: null,
  },
  {
    slug: 'platform',
    path: '/platform',
    crumb: 'Platform',
    title: 'Platform — Talent Console & Credential Ledger',
    description:
      'One operating system for transportation hiring: AI sourcing, voice screening, mobile onboarding, credential expiry tracking, compliance calendar and an HR desk.',
    imageAlt: 'The Hoflings platform — talent console, onboarding engine and credential ledger',
    extra: {
      '@type': 'SoftwareApplication',
      '@id': `${ORIGIN}/platform#app`,
      name: 'Hoflings Platform',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${ORIGIN}/platform`,
      description:
        'Talent console, onboarding engine and credential ledger for transportation hiring.',
      provider: { '@id': `${ORIGIN}/#organization` },
    },
  },
  {
    slug: 'industries',
    path: '/industries',
    crumb: 'Industries',
    title: 'Industries — Trucking, DSP, Brokerage & Warehousing',
    description:
      'Hiring and HR programs built for freight: trucking and intermodal, Amazon DSP and FedEx ISP, brokerage, warehousing, final mile and cross-border Canada.',
    imageAlt: 'Hoflings for trucking, DSP, brokerage, warehousing and final mile',
    extra: null,
  },
  {
    slug: 'hrbridge',
    path: '/hrbridge',
    crumb: 'HRBridge',
    title: 'HRBridge — AI Recruiting Software for Amazon DSP',
    description:
      'HRBridge is fully automated AI recruiting software for delivery fleets. It calls, texts and screens every applicant minutes after they apply.',
    imageAlt: 'HRBridge — fully automated AI recruiting for delivery fleets',
    extra: {
      '@type': 'SoftwareApplication',
      '@id': `${ORIGIN}/hrbridge#app`,
      name: 'HRBridge',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: `${ORIGIN}/hrbridge`,
      description:
        'Fully automated AI recruiting software for delivery fleets: calls, texts and screens every applicant minutes after they apply.',
      provider: { '@id': `${ORIGIN}/#organization` },
    },
  },
  {
    slug: 'about',
    path: '/about',
    crumb: 'About',
    title: 'About Hoflings — AI hiring for transportation',
    description:
      'Hoflings was built for the hiring problems of freight operators: driver scarcity, qualification files and compliance that spans two countries.',
    imageAlt: 'About Hoflings — AI hiring for transportation and logistics',
    extra: null,
  },
  {
    slug: 'contact',
    path: '/contact',
    crumb: 'Contact',
    title: 'Contact & Book a Demo — Hoflings',
    description:
      'Bring a live requisition. We run it through our fully automated AI recruiting engine and present a qualified shortlist within 48 hours — no pilot deck.',
    imageAlt: 'Contact Hoflings and book a demo of the AI recruiting engine',
    extra: {
      '@type': 'ContactPage',
      '@id': `${ORIGIN}/contact#contactpage`,
      url: `${ORIGIN}/contact`,
      name: 'Contact Hoflings',
      description: 'Book a demo of the Hoflings AI recruiting and onboarding engine.',
      mainEntity: { '@id': `${ORIGIN}/#organization` },
    },
  },
  {
    slug: 'privacy',
    path: '/privacy',
    crumb: 'Privacy',
    title: 'Privacy Policy — How Hoflings Handles Driver & HR Data',
    description:
      'How Hoflings Ltd collects, uses, shares and protects personal information across the Hoflings services, HRBridge recruiting software and our AI screening.',
    imageAlt: 'Privacy policy for Hoflings Ltd',
    extra: null,
  },
  {
    slug: 'terms',
    path: '/terms',
    crumb: 'Terms',
    title: 'Terms of Service — AI Recruiting, Onboarding & HR',
    description:
      'The agreement with Hoflings Ltd covering our AI recruiting and onboarding services, our HR services, automation commitments, fees, data handling and liability.',
    imageAlt: 'Terms of service for Hoflings Ltd',
    extra: null,
  },
];

/** The operations console. Restricted: noindex, no social card, no structured data. */
const CONSOLE = [
  {
    slug: 'auth',
    path: '/auth',
    title: 'Sign in — Hoflings Operations',
    description:
      'Restricted sign-in for the Hoflings operations console. Enquiries submitted through the public contact form arrive here.',
  },
  {
    slug: 'admin',
    path: '/admin',
    title: 'Enquiries — Hoflings Operations',
    description:
      'Restricted enquiries inbox for the Hoflings operations console, showing every lead submitted through the public contact form.',
  },
];

const THEME = `<script>
(function(){var d=document.documentElement;d.classList.add('js');
var t=null;try{t=localStorage.getItem('hof-theme')}catch(e){}
if(t!=='day'&&t!=='night'){t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)?'day':'night';}
d.setAttribute('data-theme',t);})();
</script>`;

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
  '<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">';

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function jsonLd(page) {
  const canonical = `${ORIGIN}${page.path}`;
  const image = `${ORIGIN}/og/${page.slug}.png`;
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${ORIGIN}/#organization`,
      name: 'Hoflings',
      legalName: LEGAL,
      url: `${ORIGIN}/`,
      logo: { '@type': 'ImageObject', url: `${ORIGIN}/og/index.png`, width: 1200, height: 630 },
      image: `${ORIGIN}/og/index.png`,
      description: TAGLINE,
      email: 'support@hoflings.com',
      address: ADDRESS,
    },
    {
      '@type': 'WebSite',
      '@id': `${ORIGIN}/#website`,
      url: `${ORIGIN}/`,
      name: 'Hoflings',
      description: TAGLINE,
      inLanguage: 'en',
      publisher: { '@id': `${ORIGIN}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: page.title,
      description: page.description,
      isPartOf: { '@id': `${ORIGIN}/#website` },
      primaryImageOfPage: { '@id': `${canonical}#primaryimage` },
      inLanguage: 'en',
    },
    {
      '@type': 'ImageObject',
      '@id': `${canonical}#primaryimage`,
      url: image,
      width: 1200,
      height: 630,
      caption: page.imageAlt,
    },
  ];

  if (page.extra) graph.push(page.extra);

  if (page.path === '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${ORIGIN}/#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      ],
    });
  } else {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: page.crumb, item: canonical },
      ],
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function publicHead(page) {
  const canonical = `${ORIGIN}${page.path}`;
  const image = `${ORIGIN}/og/${page.slug}.png`;
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="index, follow">
${THEME}
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Hoflings">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="${image}">
<meta property="og:image:secure_url" content="${image}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(page.imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${esc(page.imageAlt)}">
<meta name="theme-color" content="#05070C">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${FONTS}
<script type="application/ld+json">
${jsonLd(page)}
</script>
</head>`;
}

function consoleHead(page) {
  const canonical = `${ORIGIN}${page.path}`;
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="noindex, nofollow">
${THEME}
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#05070C">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
${FONTS}
</head>`;
}

/**
 * Replace the existing <head>...</head> block, leaving the rest of the file alone.
 *
 * The match is tested first rather than by comparing strings afterwards:
 * `String.replace` returns the input unchanged when the head is already
 * correct, so an equality check cannot tell "no head block" from "already
 * up to date" and made a second `npm run seo` fail on a clean tree.
 */
const HEAD_BLOCK = /<head>[\s\S]*?<\/head>/;

async function rewrite(file, head) {
  const path = resolve(ROOT, file);
  const html = await readFile(path, 'utf8');
  if (!HEAD_BLOCK.test(html)) throw new Error(`${file}: no <head> block found`);
  await writeFile(path, html.replace(HEAD_BLOCK, head), 'utf8');
}

/**
 * Guard rails: truncated titles and descriptions are a real loss of clicks.
 *
 * The length that matters is the one a crawler reads, which is the ESCAPED
 * string: "&" becomes "&amp;" and costs four characters in the rendered head.
 * Measuring the raw source string let three titles through at 61-64 rendered
 * characters, past the point where Google truncates the title in results.
 */
function validate(page) {
  const problems = [];
  const title = esc(page.title).length;
  const description = esc(page.description).length;
  if (title > 60) problems.push(`title ${title} chars rendered (>60)`);
  if (title < 25) problems.push(`title ${title} chars rendered (<25)`);
  if (description < 140) problems.push(`description ${description} chars rendered (<140)`);
  if (description > 160) problems.push(`description ${description} chars rendered (>160)`);
  if (problems.length) {
    throw new Error(`${page.slug}: ${problems.join('; ')}`);
  }
  return { title, description };
}

for (const page of PAGES) {
  const len = validate(page);
  await rewrite(`${page.slug}.html`, publicHead(page));
  console.log(
    `seo: ${page.slug.padEnd(10)} t=${String(len.title).padStart(2)} d=${String(len.description).padStart(3)}  ${ORIGIN}${page.path}`
  );
}

for (const page of CONSOLE) {
  await rewrite(`${page.slug}.html`, consoleHead(page));
  console.log(`seo: ${page.slug.padEnd(10)} noindex,nofollow  ${ORIGIN}${page.path}`);
}
