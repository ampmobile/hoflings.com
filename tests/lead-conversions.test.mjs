import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { onRequest } from '../functions/_middleware.js';
const source = await readFile(new URL('../public/analytics.js', import.meta.url), 'utf8');
const ID = '93a8aa87-ae5d-48f2-95a5-8e8af0174519';
function fixture(host, { storageBlocked = false, stored = '[]' } = {}) {
  const window = {}, scripts = [];
  const context = { window, location: { hostname: host }, document: { createElement: () => ({}), head: { appendChild: tag => scripts.push(tag) } }, sessionStorage: {
    getItem: () => { if (storageBlocked) throw new Error('Storage blocked'); return stored; },
    setItem: () => { if (storageBlocked) throw new Error('Storage blocked'); },
  } };
  vm.runInNewContext(source, context);
  return { window, scripts, events: () => (window.dataLayer || []).map(item => Array.from(item)).filter(item => item[0] === 'event'), reload: () => vm.runInNewContext(source, context) };
}
test('rental success records the exact Ads destination and GA4 lead once without form contents', () => {
  const f = fixture('mac-studio.hoflings.com');
  assert.equal(f.events().length, 0);
  assert.equal(f.window.HoflingsTrackLead(ID, 'rental_quote'), true);
  assert.equal(f.window.HoflingsTrackLead(ID, 'rental_quote'), false);
  const events = f.events();
  assert.equal(events.length, 2);
  assert.equal(events[0][1], 'generate_lead');
  assert.equal(events[0][2].send_to, 'G-3WWJK4WL51');
  assert.equal(events[1][1], 'conversion');
  assert.equal(events[1][2].send_to, 'AW-18587735600/vo7FCPmc_rwdELCsqZ9F');
  assert.equal(events[1][2].transaction_id, ID);
  assert.equal(events[1][2].value, 1);
  assert.equal(events[1][2].currency, 'USD');
  assert.deepEqual(Object.keys(events[1][2]).sort(), ['currency', 'send_to', 'transaction_id', 'value']);
  assert.equal(f.scripts.length, 1);
  f.reload(); assert.equal(f.scripts.length, 1);
});
test('missing saved ID, honeypot responses and unknown forms cannot become conversions', () => {
  const f = fixture('mac-studio.hoflings.com');
  for (const id of [undefined, null, '', 'not-an-id', 'email@example.com']) assert.equal(f.window.HoflingsTrackLead(id, 'rental_quote'), false);
  assert.equal(f.window.HoflingsTrackLead(ID, 'unknown'), false);
  assert.equal(f.events().length, 0);
});
test('main domain records GA4 leads while Google Ads stays rental-only', () => {
  for (const host of ['hoflings.com', 'www.hoflings.com']) {
    const f = fixture(host);
    f.window.HoflingsTrackLead(ID, 'contact_inquiry');
    assert.equal(f.events().length, 1);
    assert.equal(f.events()[0][1], 'generate_lead');
    assert.equal(f.window.dataLayer.some(args => args[1] === 'AW-18587735600'), false);
  }
});
test('previews never load production tracking; unavailable storage does not break successful forms', () => {
  const preview = fixture('localhost');
  assert.equal(preview.window.HoflingsTrackLead, undefined);
  assert.equal(preview.scripts.length, 0);
  const f = fixture('mac-studio.hoflings.com', { storageBlocked: true });
  assert.equal(f.window.HoflingsTrackLead(ID, 'rental_quote'), true);
  assert.equal(f.window.HoflingsTrackLead(ID, 'rental_quote'), false);
  const old = fixture('mac-studio.hoflings.com', { stored: JSON.stringify([ID]) });
  assert.equal(old.window.HoflingsTrackLead(ID, 'rental_quote'), false);
});
test('shared analytics on rental hostname reaches the script asset', async () => {
  const response = await onRequest({ request: new Request('https://mac-studio.hoflings.com/analytics.js'), env: { ASSETS: { fetch: req => new Response(new URL(req.url).pathname) } }, next: () => { throw new Error('Wrong route'); } });
  assert.equal(await response.text(), '/analytics.js');
});

const rentalApp = await readFile(new URL('../public/mac-studio/app.js', import.meta.url), 'utf8');
test('real rental submit handler measures accepted requests, never API failures, network failures or spam traps', async () => {
  for (const outcome of ['accepted', 'rejected', 'network', 'honeypot']) {
    const f = fixture('mac-studio.hoflings.com');
    const nodes = new Map();
    const node = selector => {
      if (!nodes.has(selector)) nodes.set(selector, {
        value: selector === '#memory' ? '256' : '24', dataset: {}, classList: { add() {}, remove() {} },
        addEventListener(type, callback) { this[type] = callback; }, setAttribute() {}, removeAttribute() {}, focus() {}, reset() {},
        querySelector: node, querySelectorAll: () => [],
      });
      return nodes.get(selector);
    };
    const context = { window: f.window, document: { querySelector: node, querySelectorAll: () => [] },
      FormData: class { *[Symbol.iterator]() { yield ['name', 'Synthetic customer']; yield ['workload', 'Private workload never sent to analytics']; } },
      fetch: async () => {
        if (outcome === 'network') throw new TypeError('Disconnected');
        return { ok: outcome !== 'rejected', json: async () => outcome === 'accepted' ? { ok: true, id: ID } : outcome === 'honeypot' ? { ok: true } : { error: 'Storage failed' } };
      },
    };
    vm.runInNewContext(rentalApp, context);
    const form = node('#request-form');
    await form.submit({ preventDefault() {}, currentTarget: form });
    assert.equal(f.events().filter(event => event[1] === 'conversion').length, outcome === 'accepted' ? 1 : 0, outcome);
    assert.equal(form.dataset.submitting, 'false');
    assert.equal(node('[type="submit"]').disabled, false);
    assert.doesNotMatch(JSON.stringify(f.window.dataLayer), /Synthetic customer|Private workload/);
  }
});
