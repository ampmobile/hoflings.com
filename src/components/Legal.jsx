import React from 'react';
import { Kicker, Btn, Icon } from '../components/Bits.jsx';
import { BRAND, HRBRIDGE } from '../data/content.js';

/**
 * Shared shell for the legal pages (Terms, Privacy, Accessibility).
 * Keeps the crumb trail, the "last updated" line and the contact block
 * identical across all three so they cannot drift apart.
 */
export const LegalPage = ({ crumb, kicker, title, lede, updated, children, aside }) => (
  <>
    <section className="phero">
      <div className="wrap phero__in">
        <nav className="crumbs">
          <a href="/">Home</a>
          <span>/</span>
          <span>{crumb}</span>
        </nav>
        <Kicker>{kicker}</Kicker>
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        {lede && <p>{lede}</p>}
        {updated && <p className="hero__src">Last updated: {updated}</p>}
      </div>
    </section>

    <section className="sec sec--top">
      <div className="wrap">
        <div className="split split--right">
          <div className="legal">{children}</div>

          <div className="legal__aside">
            <aside className="panel panel--tick">
              <span className="panel__idx">Contact</span>
              <h3 style={{ marginTop: 12, fontSize: 19 }}>Questions about this page</h3>
              <p className="tiny dim" style={{ marginTop: 8 }}>
                Write to us and a person who works on this will answer — not a form response.
              </p>
              <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
                <div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '.12em' }}>EMAIL</div>
                  <a href={`mailto:${BRAND.email}`} style={{ fontSize: 15 }}>
                    {BRAND.email}
                  </a>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '.12em' }}>
                    REGISTERED ENTITY
                  </div>
                  <div style={{ fontSize: 15 }}>{BRAND.legalName}</div>
                  <div className="tiny dim">
                    {BRAND.address.line1}
                    <br />
                    {BRAND.address.line2}
                    <br />
                    {BRAND.address.country}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <Btn href="/contact.html" variant="line" size="sm">
                  Contact us
                  <Icon name="arrow" />
                </Btn>
              </div>
            </aside>

            {aside}

            <aside className="panel panel--tick">
              <span className="panel__idx">Other pages</span>
              <ul className="panel__list" style={{ marginTop: 14 }}>
                <li>
                  <span>
                    <a href="/terms.html">Terms of Service</a>
                  </span>
                </li>
                <li>
                  <span>
                    <a href="/privacy.html">Privacy Policy</a>
                  </span>
                </li>
                <li>
                  <span>
                    <a href="/about.html">About Hoflings</a>
                  </span>
                </li>
                <li>
                  <span>
                    <a href={HRBRIDGE.url} target="_blank" rel="noopener noreferrer">
                      {HRBRIDGE.domain}
                    </a>
                  </span>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </section>
  </>
);

/** Small helper for the numbered legal sections. */
export const LegalSection = ({ id, n, title, children }) => (
  <section id={id} className="legal__s">
    <h2>
      {n && <span className="legal__n">{n}</span>}
      {title}
    </h2>
    {children}
  </section>
);
