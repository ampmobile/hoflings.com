import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { buildLeadMetadata, classifyTouch, parseVisitorAgent } from '../functions/_shared/lead-metadata.js';

test('campaign classification distinguishes tagged ads, search, referrals and missing attribution', () => {
  assert.equal(classifyTouch({ click_ids: { gclid: 'example-click' }, referrer: 'https://www.google.com/' }).channel, 'Google Ads');
  assert.equal(classifyTouch({ utm: { source: 'google', medium: 'cpc' } }).channel, 'Google Ads');
  assert.equal(classifyTouch({ referrer: 'https://www.google.co.uk/search' }).channel, 'Google Search');
  assert.equal(classifyTouch({ referrer: 'https://www.bing.com/search' }).channel, 'Other search');
  assert.equal(classifyTouch({ referrer: 'https://cloudmac.dev/providers/' }).channel, 'Referral');
  assert.equal(classifyTouch({ click_ids: { fbclid: 'example-click' } }).channel, 'Social');
  assert.equal(classifyTouch({}).channel, 'Direct / unknown');
  assert.notEqual(classifyTouch({ referrer: 'https://mail.google.com/' }).channel, 'Google Search');
});

test('metadata uses server geolocation, removes arbitrary URL queries, and bounds client input', () => {
  const request = new Request('https://hoflings.com/contacts', {
    headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Version/18.0 Mobile/15E148 Safari/604.1', 'cf-connecting-ip': '192.0.2.10' },
  });
  Object.defineProperty(request, 'cf', { value: { country: 'US', region: 'New Jersey', city: 'Newark', timezone: 'America/New_York', asn: 64500, asOrganization: 'Example network' } });
  const result = buildLeadMetadata(request, {
    first_touch: { landing_page: 'https://hoflings.com/?email=private@example.com#secret', referrer: 'https://www.google.com/search?q=private', utm: { source: 'google', medium: 'cpc', campaign: 'A'.repeat(500) } },
    last_touch: { landing_page: 'https://hoflings.com/contact', referrer: '', click_ids: { gclid: 'example-click' } },
    current_page: 'https://hoflings.com/contact?email=private@example.com',
    country: 'FAKE', city: 'Fake City',
    browser: { timezone: 'Europe/London', language: 'en-US', screen: { width: 390, height: 844 }, viewport: { width: 390, height: 700 } },
  });
  assert.equal(result.visitor_context.location.city, 'Newark');
  assert.equal(result.visitor_context.location.timezone, 'America/New_York');
  assert.equal(result.visitor_context.browser_timezone, 'Europe/London');
  assert.equal(result.visitor_context.device, 'Mobile');
  assert.equal(result.visitor_context.browser, 'Safari');
  assert.equal(result.attribution.first_touch.landing_page, 'https://hoflings.com/');
  assert.equal(result.attribution.first_touch.referrer, 'https://www.google.com/search');
  assert.equal(result.attribution.first_touch.utm.campaign.length, 120);
  assert.equal(result.attribution.last_touch.channel, 'Google Ads');
  assert.doesNotMatch(JSON.stringify(result), /private@example|Fake City/);
});

test('unavailable geo and referral data remain unavailable rather than invented', () => {
  const result = buildLeadMetadata(new Request('https://hoflings.com/contacts'), {});
  assert.equal(result.attribution.first_touch, null);
  assert.equal(result.visitor_context.location.city, '');
  assert.equal(result.visitor_context.location.timezone, '');
  assert.equal(result.visitor_context.browser_timezone, '');
  assert.equal(result.visitor_context.device, 'Unknown');
});

test('browser/device inference handles common desktops, mobiles and iPad desktop user agents', () => {
  assert.equal(parseVisitorAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36 Edg/130.0').browser, 'Edge');
  assert.equal(parseVisitorAgent('Mozilla/5.0 (Linux; Android 14) AppleWebKit Chrome/130.0 Safari/537.36').device, 'Tablet');
  assert.equal(parseVisitorAgent('Mozilla/5.0 (Linux; Android 14) Mobile Chrome/130.0').device, 'Mobile');
  assert.equal(parseVisitorAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/18.0 Safari/605.1', { touch_points: 5 }).device, 'Tablet');
});

const browserScript = readFileSync(new URL('../public/lead-context.js', import.meta.url), 'utf8');
function browserPage(url, referrer, cookies, storage) {
  const document = { referrer };
  Object.defineProperty(document, 'cookie', {
    get: () => [...cookies.entries()].map(([key, value]) => `${key}=${value}`).join('; '),
    set: value => { const pair = value.split(';')[0]; const index = pair.indexOf('='); cookies.set(pair.slice(0, index), pair.slice(index + 1)); },
  });
  const window = {};
  vm.runInNewContext(browserScript, {
    window, document, location: new URL(url), URL, Date, Intl,
    localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
    navigator: { language: 'en-US', languages: ['en-US'], platform: 'MacIntel', maxTouchPoints: 0 },
    screen: { width: 1440, height: 900 }, innerWidth: 1200, innerHeight: 800,
  });
  return window.HoflingsLeadContext.get();
}

test('first campaign survives navigation and a move between Hoflings subdomains', () => {
  const cookies = new Map(), storage = new Map();
  const first = browserPage('https://hoflings.com/?utm_source=google&utm_medium=cpc&gclid=click-123&email=private', 'https://www.google.com/', cookies, storage);
  const next = browserPage('https://hoflings.com/contact', 'https://hoflings.com/', cookies, storage);
  const rental = browserPage('https://mac-studio.hoflings.com/', 'https://hoflings.com/contact', cookies, new Map());
  assert.equal(first.first_touch.click_ids.gclid, 'click-123');
  assert.equal(next.last_touch.click_ids.gclid, 'click-123');
  assert.equal(rental.first_touch.click_ids.gclid, 'click-123');
  assert.equal(rental.last_touch.click_ids.gclid, 'click-123');
  assert.equal(rental.current_page, 'https://mac-studio.hoflings.com/');
  assert.doesNotMatch(JSON.stringify(rental), /email=private/);
  const referral = browserPage('https://hoflings.com/contact', 'https://cloudmac.dev/', cookies, storage);
  assert.equal(referral.first_touch.click_ids.gclid, 'click-123');
  assert.equal(referral.last_touch.referrer, 'https://cloudmac.dev/');
});

test('attribution capture tolerates browsers that disallow storage', () => {
  const document = { referrer: '' };
  Object.defineProperty(document, 'cookie', { get: () => { throw Error('blocked'); }, set: () => { throw Error('blocked'); } });
  const window = {};
  vm.runInNewContext(browserScript, { window, document, URL, Date, Intl, location: new URL('https://hoflings.com/'), navigator: {}, screen: {}, innerWidth: 1, innerHeight: 1, localStorage: { getItem: () => { throw Error('blocked'); }, setItem: () => { throw Error('blocked'); } } });
  assert.equal(window.HoflingsLeadContext.get().first_touch.landing_page, 'https://hoflings.com/');
});
