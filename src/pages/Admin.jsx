import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const STATUSES = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'archived', label: 'Archived' },
];

const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const csvCell = (v) => {
  const raw = String(v ?? '');
  const safe = /^\s*[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
};

const countryName = (code) => {
  if (!code) return '';
  try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code; } catch { return code; }
};
const locationLabel = (c) => {
  const geo = c.visitor_context?.location || {};
  return [geo.city, geo.region, countryName(geo.country)].filter(Boolean).join(', ');
};
const sourceLabel = (touch) => touch?.channel || 'Not recorded';
const dimensions = (value) => value?.width && value?.height ? `${value.width} × ${value.height}` : 'Not recorded';
const browserLabel = (c) => [c.visitor_context?.browser, c.visitor_context?.browser_version].filter(Boolean).join(' ') || 'Not recorded';

function TrafficTouch({ title, touch }) {
  if (!touch) return <div><span className="admin__label">{title}</span><span>Not recorded</span></div>;
  return (
    <div className="admin__touch">
      <h3>{title}: <span>{sourceLabel(touch)}</span></h3>
      <div className="admin__grid">
        <div><span className="admin__label">Classification evidence</span><span>{touch.evidence || 'Not recorded'}</span></div>
        <div><span className="admin__label">Visit recorded</span><span>{fmtDate(touch.captured_at)}</span></div>
        <div><span className="admin__label">Landing page</span><span>{touch.landing_page || 'Not recorded'}</span></div>
        <div><span className="admin__label">External referrer</span><span>{touch.referrer || 'Not available / direct'}</span></div>
        {Object.entries(touch.utm || {}).map(([key, value]) => <div key={key}><span className="admin__label">UTM {key}</span><span>{value}</span></div>)}
        {Object.entries(touch.click_ids || {}).map(([key, value]) => <div key={key}><span className="admin__label">{key}</span><span>{value}</span></div>)}
      </div>
    </div>
  );
}

function InquiryContext({ contact: c }) {
  const visitor = c.visitor_context || {}, geo = visitor.location || {}, network = visitor.network || {};
  const attribution = c.attribution || {};
  return (
    <div className="admin__context">
      <h3>Referral & visitor details</h3>
      <p className="admin__contextnote">Source classification uses campaign tags, click identifiers and referrers. Untagged ads may look like search or direct visits. IP location is approximate and may reflect a VPN or network gateway.</p>
      <div className="admin__grid">
        <div><span className="admin__label">Submission page</span><span>{attribution.current_page || c.source || 'Not recorded'}</span></div>
        <div><span className="admin__label">Country</span><span>{countryName(geo.country) || 'Not recorded'}</span></div>
        <div><span className="admin__label">State / region</span><span>{geo.region || geo.region_code || 'Not recorded'}</span></div>
        <div><span className="admin__label">City</span><span>{geo.city || 'Not recorded'}</span></div>
        <div><span className="admin__label">Postal code (approximate)</span><span>{geo.postal_code || 'Not recorded'}</span></div>
        <div><span className="admin__label">IP-location time zone</span><span>{geo.timezone || 'Not recorded'}</span></div>
        <div><span className="admin__label">Browser time zone</span><span>{visitor.browser_timezone || 'Not recorded'}</span></div>
        <div><span className="admin__label">Device type</span><span>{visitor.device || 'Not recorded'}</span></div>
        <div><span className="admin__label">Browser</span><span>{browserLabel(c)}</span></div>
        <div><span className="admin__label">Operating system</span><span>{visitor.os || 'Not recorded'}</span></div>
        <div><span className="admin__label">Language</span><span>{visitor.languages?.join(', ') || visitor.language || 'Not recorded'}</span></div>
        <div><span className="admin__label">Screen size</span><span>{dimensions(visitor.screen)}</span></div>
        <div><span className="admin__label">Browser viewport</span><span>{dimensions(visitor.viewport)}</span></div>
        <div><span className="admin__label">IP address</span><span>{visitor.ip_address || 'Not recorded'}</span></div>
        <div><span className="admin__label">Network / ISP</span><span>{network.organization || 'Not recorded'}{network.asn ? ` · AS${network.asn}` : ''}</span></div>
        <div><span className="admin__label">Location data source</span><span>{visitor.location_source || 'Not recorded'}</span></div>
      </div>
      <TrafficTouch title="First recorded visit" touch={attribution.first_touch} />
      <TrafficTouch title="Latest campaign / external referral" touch={attribution.last_touch} />
      {(visitor.user_agent || c.user_agent) && <details className="admin__agent"><summary>Raw browser user agent</summary><p>{visitor.user_agent || c.user_agent}</p></details>}
    </div>
  );
}

/**
 * The enquiries inbox — mounted at /admin.
 *
 * Reads through `/admin/contacts`, which checks the session cookie server
 * side against the configured admin address before returning anything.
 */
export default function Admin() {
  const [state, setState] = useState('loading');
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const { ok, data } = await api('/admin/contacts');
    if (data?.error === 'Not signed in.') {
      window.location.replace('/auth');
      return;
    }
    if (!ok) {
      setState('error');
      setError(data?.error || 'Could not load the inbox.');
      return;
    }
    setContacts(data.contacts || []);
    setState('ready');
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (filter !== 'all' && (c.status || 'new') !== filter) return false;
      if (!q) return true;
      return [c.name, c.email, c.company, c.message, c.role, c.region, locationLabel(c), browserLabel(c),
        c.visitor_context?.device, c.visitor_context?.os, JSON.stringify(c.attribution || {})]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [contacts, filter, query]);

  const counts = useMemo(() => {
    const c = { all: contacts.length, new: 0, contacted: 0, archived: 0 };
    contacts.forEach((x) => {
      c[x.status || 'new'] = (c[x.status || 'new'] || 0) + 1;
    });
    return c;
  }, [contacts]);

  const setStatus = async (id, status) => {
    const { ok } = await api('/admin/contacts', { method: 'PATCH', body: { id, status } });
    if (!ok) {
      setError('Could not update that enquiry.');
      return;
    }
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    const { ok } = await api('/admin/contacts', { method: 'DELETE', body: { id } });
    if (!ok) {
      setError('Could not delete that enquiry.');
      return;
    }
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (open === id) setOpen(null);
  };

  const exportCsv = () => {
    const cols = ['created_at', 'name', 'email', 'company', 'phone', 'role', 'region', 'fleet', 'status', 'message',
      'source', 'first_source', 'latest_source', 'submission_page', 'country', 'state', 'city', 'postal_code',
      'ip_timezone', 'browser_timezone', 'device', 'browser', 'os', 'language', 'ip_address', 'network',
      'first_utm', 'latest_utm', 'click_identifiers'];
    const lines = [cols.join(',')];
    contacts.forEach((c) => {
      const a = c.attribution || {}, v = c.visitor_context || {}, geo = v.location || {};
      const row = { ...c, first_source: sourceLabel(a.first_touch), latest_source: sourceLabel(a.last_touch),
        submission_page: a.current_page, country: countryName(geo.country), state: geo.region, city: geo.city,
        postal_code: geo.postal_code, ip_timezone: geo.timezone, browser_timezone: v.browser_timezone,
        device: v.device, browser: browserLabel(c), os: v.os, language: v.language, ip_address: v.ip_address,
        network: v.network?.organization, first_utm: JSON.stringify(a.first_touch?.utm || {}),
        latest_utm: JSON.stringify(a.last_touch?.utm || {}), click_identifiers: JSON.stringify(a.last_touch?.click_ids || {}) };
      lines.push(cols.map(k => csvCell(row[k])).join(','));
    });
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hoflings-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    window.location.replace('/auth');
  };

  if (state === 'loading') {
    return (
      <section className="sec sec--tight">
        <div className="wrap">
          <p className="kicker">Operations console</p>
          <p className="lede">Loading the inbox…</p>
        </div>
      </section>
    );
  }

  if (state === 'error') {
    return (
      <section className="sec sec--tight">
        <div className="wrap">
          <p className="kicker">Operations console</p>
          <h1 className="auth__title">Inbox unavailable</h1>
          <p className="lede">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="sec sec--tight admin">
      <div className="wrap">
        <div className="admin__bar">
          <div>
            <p className="kicker">Operations console</p>
            <h1 className="admin__title">Enquiries</h1>
            <p className="lede admin__lede">
              {counts.all} total · {counts.new} new · {counts.contacted} contacted · {counts.archived} archived
            </p>
          </div>
          <div className="admin__actions">
            <button className="btn btn--line" type="button" onClick={load}>
              Refresh
            </button>
            <button className="btn btn--line" type="button" onClick={exportCsv}>
              Export CSV
            </button>
            <button className="btn btn--line" type="button" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>

        <div className="admin__filters">
          <div className="admin__tabs" role="tablist" aria-label="Filter enquiries">
            {['all', ...STATUSES.map((s) => s.id)].map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={filter === id}
                className={`admin__tab${filter === id ? ' is-on' : ''}`}
                onClick={() => setFilter(id)}
              >
                {id === 'all' ? 'All' : STATUSES.find((s) => s.id === id).label}
                <span className="admin__count">{counts[id] ?? 0}</span>
              </button>
            ))}
          </div>
          <input
            className="admin__search"
            type="search"
            placeholder="Search name, source, city, device or message"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search enquiries"
          />
        </div>

        {error && <p className="auth__msg auth__msg--bad">{error}</p>}

        {!visible.length && (
          <div className="panel admin__empty">
            <h3>Nothing here yet</h3>
            <p>
              Enquiries submitted through the contact form land in this inbox the moment they arrive, and an email goes to
              the site administrator at the same time.
            </p>
          </div>
        )}

        <ul className="admin__list">
          {visible.map((c) => {
            const isOpen = open === c.id;
            const status = c.status || 'new';
            return (
              <li key={c.id} className={`admin__item${isOpen ? ' is-open' : ''}`}>
                <button className="admin__row" type="button" onClick={() => setOpen(isOpen ? null : c.id)}>
                  <span className={`admin__pip admin__pip--${status}`} aria-hidden="true" />
                  <span className="admin__who">
                    <b>{c.name}</b>
                    <em>{c.company}</em>
                  </span>
                  <span className="admin__role">{c.role || '—'}</span>
                  <span className="admin__origin">
                    <b>{sourceLabel(c.attribution?.last_touch)}</b>
                    <span>{locationLabel(c) || 'Location not recorded'} · {c.visitor_context?.device || 'Device not recorded'}</span>
                  </span>
                  <span className="admin__when">{fmtDate(c.created_at)}</span>
                </button>

                {isOpen && (
                  <div className="admin__detail">
                    <div className="admin__grid">
                      <div>
                        <span className="admin__label">Email</span>
                        <a href={`mailto:${c.email}`}>{c.email}</a>
                      </div>
                      <div>
                        <span className="admin__label">Phone</span>
                        <span>{c.phone || '—'}</span>
                      </div>
                      <div>
                        <span className="admin__label">Region</span>
                        <span>{c.region || '—'}</span>
                      </div>
                      <div>
                        <span className="admin__label">Fleet</span>
                        <span>{c.fleet || '—'}</span>
                      </div>
                      <div>
                        <span className="admin__label">Notification</span>
                        <span>{c.notified ? 'email sent' : 'not sent'}</span>
                      </div>
                      <div>
                        <span className="admin__label">Received</span>
                        <span>{fmtDate(c.created_at)}</span>
                      </div>
                    </div>

                    <p className="admin__message">{c.message}</p>

                    <InquiryContext contact={c} />

                    <div className="admin__foot">
                      <div className="admin__status">
                        {STATUSES.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            className={`admin__statusbtn${status === s.id ? ' is-on' : ''}`}
                            onClick={() => setStatus(c.id, s.id)}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      <div className="admin__rowactions">
                        <a className="btn btn--line" href={`mailto:${c.email}?subject=${encodeURIComponent(
                          `Re: your Hoflings enquiry — ${c.company}`
                        )}`}>
                          Reply
                        </a>
                        <button className="btn btn--line admin__del" type="button" onClick={() => remove(c.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
