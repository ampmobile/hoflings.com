/* First visit and latest external/campaign source, shared across Hoflings subdomains. */
(function () {
  'use strict';
  var KEY = 'hof_lead_attribution_v1';
  var MAX_AGE = 30 * 24 * 60 * 60 * 1000;
  var UTM = ['source', 'medium', 'campaign', 'term', 'content', 'id'];
  var CLICKS = ['gclid', 'gbraid', 'wbraid', 'dclid', 'msclkid', 'fbclid'];
  var memory;
  function text(value, max) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
  function cleanUrl(value) {
    try {
      var url = new URL(value);
      return /^https?:$/.test(url.protocol) ? (url.origin + url.pathname).slice(0, 500) : '';
    } catch (_) { return ''; }
  }
  function internal(value) {
    try { return /(^|\.)hoflings\.com$/.test(new URL(value).hostname); } catch (_) { return false; }
  }
  function read() {
    if (memory) return memory;
    try {
      var cookie = document.cookie.split('; ').find(function (part) { return part.startsWith(KEY + '='); });
      if (cookie) return JSON.parse(decodeURIComponent(cookie.slice(KEY.length + 1)));
    } catch (_) {}
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; }
  }
  function persist(value) {
    memory = value;
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (_) {}
    try {
      var encoded = encodeURIComponent(JSON.stringify(value));
      if (encoded.length > 3500) return;
      var domain = /(^|\.)hoflings\.com$/.test(location.hostname) ? '; Domain=hoflings.com' : '';
      document.cookie = KEY + '=' + encoded + '; Path=/; Max-Age=2592000; SameSite=Lax' + domain + (location.protocol === 'https:' ? '; Secure' : '');
    } catch (_) {}
  }
  function capture() {
    var now = new Date().toISOString();
    var params = new URL(location.href).searchParams;
    var touch = { captured_at: now, landing_page: cleanUrl(location.href), referrer: cleanUrl(document.referrer), utm: {}, click_ids: {} };
    UTM.forEach(function (key) { var value = text(params.get('utm_' + key), 120); if (value) touch.utm[key] = value; });
    CLICKS.forEach(function (key) { var value = text(params.get(key), 160); if (value) touch.click_ids[key] = value; });
    var stored = read();
    var firstDate = stored && stored.first_touch && Date.parse(stored.first_touch.captured_at);
    if (!firstDate || Date.now() - firstDate > MAX_AGE || firstDate > Date.now() + 60000) stored = null;
    var campaign = Object.keys(touch.utm).length || Object.keys(touch.click_ids).length;
    var external = touch.referrer && !internal(touch.referrer);
    var value = stored || { first_touch: touch, last_touch: touch };
    if (campaign || external) value.last_touch = touch;
    persist(value);
    return value;
  }
  function get() {
    var value = read() || capture();
    var timezone = '';
    try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (_) {}
    return {
      version: 1,
      first_touch: value.first_touch,
      last_touch: value.last_touch,
      current_page: cleanUrl(location.href),
      browser: {
        timezone: timezone,
        language: navigator.language || '',
        languages: Array.from(navigator.languages || []).slice(0, 5),
        platform: navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform || '',
        mobile: navigator.userAgentData ? navigator.userAgentData.mobile : null,
        touch_points: navigator.maxTouchPoints || 0,
        screen: { width: screen.width, height: screen.height },
        viewport: { width: innerWidth, height: innerHeight },
      },
    };
  }
  capture();
  window.HoflingsLeadContext = { get: get };
})();
