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

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;

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
      return [c.name, c.email, c.company, c.message, c.role, c.region]
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
    const cols = ['created_at', 'name', 'email', 'company', 'phone', 'role', 'region', 'fleet', 'status', 'message'];
    const lines = [cols.join(',')];
    contacts.forEach((c) => lines.push(cols.map((k) => csvCell(c[k])).join(',')));
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
            placeholder="Search name, company or message"
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
