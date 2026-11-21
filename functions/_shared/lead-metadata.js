const UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content', 'id'];
const CLICK_KEYS = ['gclid', 'gbraid', 'wbraid', 'dclid', 'msclkid', 'fbclid'];
const text = (value, max = 200) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const number = (value, max = 20000) => Number.isFinite(value) && value >= 0 ? Math.min(Math.round(value), max) : null;

export function cleanLeadUrl(value) {
  try {
    const url = new URL(text(value, 2048));
    return /^https?:$/.test(url.protocol) ? `${url.origin}${url.pathname}`.slice(0, 500) : '';
  } catch { return ''; }
}

export function classifyTouch(touch) {
  const utm = object(touch.utm), ids = object(touch.click_ids);
  const source = text(utm.source).toLowerCase(), medium = text(utm.medium).toLowerCase();
  let host = '';
  try { host = new URL(touch.referrer).hostname.toLowerCase(); } catch {}
  const paid = /^(cpc|ppc|paid|paidsearch|paid_search|paid-social|paid_social|cpm|display|video|retargeting)$/.test(medium);
  if (ids.gclid || ids.gbraid || ids.wbraid || ids.dclid)
    return { channel: 'Google Ads', evidence: 'Google advertising click identifier' };
  if (ids.msclkid) return { channel: 'Microsoft Ads', evidence: 'Microsoft advertising click identifier' };
  if (paid && /google|adwords/.test(source)) return { channel: 'Google Ads', evidence: 'Paid Google UTM tags' };
  if (paid) return { channel: 'Paid traffic', evidence: `UTM source: ${source || 'not supplied'}; medium: ${medium}` };
  if (medium === 'email') return { channel: 'Email', evidence: 'Email UTM tag' };
  if (medium === 'organic' && source === 'google') return { channel: 'Google Search', evidence: 'Organic Google UTM tags' };
  if (source) return { channel: 'Campaign', evidence: `UTM source: ${source}; medium: ${medium || 'not supplied'}` };
  if (/^(www\.)?google\.[a-z.]+$/.test(host))
    return { channel: 'Google Search', evidence: 'Google search referrer; untagged ads cannot be ruled out' };
  if (/(^|\.)(bing\.com|duckduckgo\.com|search\.yahoo\.com|ecosia\.org)$/.test(host))
    return { channel: 'Other search', evidence: `Search referrer: ${host}` };
  if (/(^|\.)(facebook\.com|instagram\.com|linkedin\.com|t\.co|x\.com|twitter\.com|reddit\.com|youtube\.com)$/.test(host) || ids.fbclid)
    return { channel: 'Social', evidence: host ? `Social referrer: ${host}` : 'Meta click identifier; paid versus organic unknown' };
  if (host && !/(^|\.)hoflings\.com$/.test(host)) return { channel: 'Referral', evidence: `Referring site: ${host}` };
  if (host) return { channel: 'Internal / unknown', evidence: 'Only an internal Hoflings referrer was recorded' };
  return { channel: 'Direct / unknown', evidence: 'No external referrer or campaign tags available' };
}

function normalizeTouch(value) {
  const src = object(value);
  const landing = cleanLeadUrl(src.landing_page);
  if (!landing) return null;
  const touch = { landing_page: landing, referrer: cleanLeadUrl(src.referrer), utm: {}, click_ids: {} };
  const timestamp = Date.parse(src.captured_at);
  if (Number.isFinite(timestamp) && timestamp <= Date.now() + 60000 && timestamp > Date.now() - 31 * 86400000)
    touch.captured_at = new Date(timestamp).toISOString();
  for (const key of UTM_KEYS) { const value = text(object(src.utm)[key], 120); if (value) touch.utm[key] = value; }
  for (const key of CLICK_KEYS) { const value = text(object(src.click_ids)[key], 160); if (value) touch.click_ids[key] = value; }
  return { ...touch, ...classifyTouch(touch) };
}

function timezone(value) {
  try { return new Intl.DateTimeFormat('en', { timeZone: text(value, 100) }).resolvedOptions().timeZone; } catch { return ''; }
}

export function parseVisitorAgent(ua, browser = {}) {
  const match = (pattern) => ua.match(pattern)?.[1] || '';
  let name = 'Unknown', version = '';
  if (/Edg(?:A|iOS)?\//.test(ua)) { name = 'Edge'; version = match(/Edg(?:A|iOS)?\/([\d.]+)/); }
  else if (/OPR\//.test(ua)) { name = 'Opera'; version = match(/OPR\/([\d.]+)/); }
  else if (/SamsungBrowser\//.test(ua)) { name = 'Samsung Internet'; version = match(/SamsungBrowser\/([\d.]+)/); }
  else if (/Firefox\/|FxiOS\//.test(ua)) { name = 'Firefox'; version = match(/(?:Firefox|FxiOS)\/([\d.]+)/); }
  else if (/Chrome\/|CriOS\//.test(ua)) { name = 'Chrome'; version = match(/(?:Chrome|CriOS)\/([\d.]+)/); }
  else if (/Safari\//.test(ua)) { name = 'Safari'; version = match(/Version\/([\d.]+)/); }
  const tablet = /iPad|Tablet|Silk/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua)) || (/Macintosh/.test(ua) && browser.touch_points > 1);
  const device = /bot|crawler|spider|headless/i.test(ua) ? 'Bot / automated' : tablet ? 'Tablet' : /Mobile|iPhone|iPod/.test(ua) || browser.mobile === true ? 'Mobile' : ua ? 'Desktop' : 'Unknown';
  const os = /iPad|iPhone|iPod/.test(ua) || (tablet && /Macintosh/.test(ua)) ? 'iOS / iPadOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /CrOS/.test(ua) ? 'ChromeOS' : /Mac OS X|Macintosh/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : text(browser.platform, 80) || 'Unknown';
  return { browser: name, browser_version: version, device, os };
}

export function buildLeadMetadata(request, input) {
  const src = object(input), browser = object(src.browser), cf = object(request.cf);
  const ua = text(request.headers.get('user-agent'), 600);
  const first = normalizeTouch(src.first_touch), last = normalizeTouch(src.last_touch);
  const ip = text(request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0], 64);
  const location = {
    country: text(cf.country || request.headers.get('cf-ipcountry'), 2),
    region: text(cf.region, 120), region_code: text(cf.regionCode, 20), city: text(cf.city, 120),
    postal_code: text(cf.postalCode, 30), continent: text(cf.continent, 2), timezone: timezone(cf.timezone),
  };
  const dimension = value => ({ width: number(object(value).width), height: number(object(value).height) });
  return {
    attribution: {
      first_touch: first, last_touch: last,
      current_page: cleanLeadUrl(src.current_page) || cleanLeadUrl(request.headers.get('referer')),
    },
    visitor_context: {
      recorded_at: new Date().toISOString(), ...parseVisitorAgent(ua, browser),
      ip_address: ip,
      location, location_source: location.country ? 'Cloudflare IP geolocation (approximate)' : 'Not available',
      browser_timezone: timezone(browser.timezone), language: text(browser.language || request.headers.get('accept-language')?.split(',')[0], 80),
      languages: Array.isArray(browser.languages) ? browser.languages.slice(0, 5).map(value => text(value, 40)).filter(Boolean) : [],
      screen: dimension(browser.screen), viewport: dimension(browser.viewport),
      network: { asn: number(cf.asn, 4294967295), organization: text(cf.asOrganization, 180) },
      edge_location: text(cf.colo, 10), user_agent: ua,
    },
  };
}
