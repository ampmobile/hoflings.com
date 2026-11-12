import React, { useState, useRef } from 'react';
import { gsap, REDUCED } from '../lib/motion.js';
import { Icon } from './Bits.jsx';
import { SOURCES, BRAND } from '../data/content.js';

/* ------------------------------ Tabs ------------------------------ */
export function Tabs({ items }) {
  const [active, setActive] = useState(0);
  const select = (i) => {
    setActive(i);
    if (REDUCED) return;
    const panel = document.getElementById(`tp-${items[i].key}`);
    if (panel) {
      gsap.fromTo(
        panel.querySelectorAll('[data-rv]'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.05 }
      );
    }
  };
  const onKey = (e, i) => {
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % items.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + items.length) % items.length;
    if (n !== null) {
      e.preventDefault();
      select(n);
      document.getElementById(`tab-${items[n].key}`)?.focus();
    }
  };

  return (
    <div className="tabs">
      <div className="tabs__list" role="tablist" aria-label="Role categories">
        {items.map((r, i) => (
          <button
            key={r.key}
            id={`tab-${r.key}`}
            className="tabs__tab"
            role="tab"
            aria-selected={active === i}
            aria-controls={`tp-${r.key}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {r.title}
            <Icon name="arrow" />
          </button>
        ))}
      </div>

      <div>
        {items.map((r, i) => (
          <div
            className="tabs__panel"
            role="tabpanel"
            id={`tp-${r.key}`}
            aria-labelledby={`tab-${r.key}`}
            key={r.key}
            hidden={active !== i}
          >
            <h3 data-rv>{r.title}</h3>
            <p className="dim" data-rv style={{ maxWidth: '62ch' }}>
              {r.lead}
            </p>
            <div className="tabs__cols">
              <div data-rv>
                <h5>What we screen</h5>
                <ul>
                  {r.screen.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div data-rv>
                <h5>How we help</h5>
                <ul>
                  {r.help.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ FAQ ------------------------------ */
export function Faq({ items }) {
  const [open, setOpen] = useState(null);
  const openRef = useRef(null);
  const toggle = (i) => {
    const next = openRef.current === i ? null : i;
    openRef.current = next;
    setOpen(next);
    const panel = document.getElementById(`fq-${i}`);
    if (!panel || REDUCED) return;
    const h = panel.scrollHeight;
    if (next === null) {
      panel.style.height = `${h}px`;
      requestAnimationFrame(() => {
        panel.style.height = '0px';
      });
    } else {
      panel.style.height = `${h}px`;
      setTimeout(() => {
        if (openRef.current === i) panel.style.height = 'auto';
      }, 360);
    }
  };

  return (
    <div className="faq">
      {items.map((f, i) => {
        const src = f.src ? SOURCES[f.src] : null;
        return (
          <div className="faq__i" key={f.q}>
            <button
              className="faq__q"
              aria-expanded={open === i}
              aria-controls={`fq-${i}`}
              onClick={() => toggle(i)}
            >
              {f.q}
            </button>
            <div className="faq__a" id={`fq-${i}`}>
              <div>
                {f.a.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                {src && (
                  <p className="faq__cite">
                    <span className="src">
                      <span>Reference: </span>
                      <a href={src.url} target="_blank" rel="noopener noreferrer">
                        {src.label}
                      </a>
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------- Contact form --------------------------- */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const d = new FormData(form);
    const subject = `Hoflings enquiry — ${d.get('company') || 'New lead'}`;
    const body = [];
    d.forEach((v, k) => {
      if (v) body.push(`${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`);
    });
    setSent(true);
    window.location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body.join('\n'))}`;
  };

  return (
    <form className="panel panel--tick" onSubmit={submit} style={{ padding: 'clamp(24px, 2.8vw, 36px)' }}>
      <div className={`ok${sent ? ' is-on' : ''}`}>
        <Icon name="check" />
        <div>
          <b>Your email client is opening.</b>
          <p>If nothing happens, write to {BRAND.email} and we will pick it up straight away.</p>
        </div>
      </div>

      <div className="frow">
        <div className="field">
          <label htmlFor="f-name">Full name</label>
          <input id="f-name" name="name" type="text" autoComplete="name" placeholder="Jordan Reyes" required />
        </div>
        <div className="field">
          <label htmlFor="f-email">Work email</label>
          <input id="f-email" name="email" type="email" autoComplete="email" placeholder="jordan@company.com" required />
        </div>
      </div>

      <div className="frow">
        <div className="field">
          <label htmlFor="f-company">Company</label>
          <input id="f-company" name="company" type="text" autoComplete="organization" placeholder="Ridgeline Freight LLC" required />
        </div>
        <div className="field">
          <label htmlFor="f-phone">Phone (optional)</label>
          <input id="f-phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      <div className="frow">
        <div className="field">
          <label htmlFor="f-role">Role you need filled</label>
          <select id="f-role" name="role" required defaultValue="">
            <option value="" disabled>
              Select a role
            </option>
            <option>OTR / line-haul driver</option>
            <option>Local / final-mile driver</option>
            <option>DSP or delivery service owner</option>
            <option>Dispatcher</option>
            <option>Warehouse / yard operations</option>
            <option>Fleet mechanic / technician</option>
            <option>Safety / compliance</option>
            <option>Corporate / administrative</option>
            <option>Multiple roles</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-region">Region</label>
          <select id="f-region" name="region" required defaultValue="">
            <option value="" disabled>
              Select a region
            </option>
            <option>United States — Midwest</option>
            <option>United States — South</option>
            <option>United States — Northeast</option>
            <option>United States — West</option>
            <option>Canada — Ontario</option>
            <option>Canada — Alberta</option>
            <option>Canada — British Columbia</option>
            <option>Canada — Prairies or Atlantic</option>
            <option>Cross-border / both</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-fleet">Fleet size or headcount</label>
        <select id="f-fleet" name="fleet" defaultValue="">
          <option value="">Select a range</option>
          <option>Under 25 employees</option>
          <option>25 – 100 employees</option>
          <option>101 – 300 employees</option>
          <option>301 – 1,000 employees</option>
          <option>More than 1,000 employees</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-msg">What problem are you trying to solve?</label>
        <textarea
          id="f-msg"
          name="message"
          placeholder="We need six Class A drivers for dedicated runs out of Dallas, and every agency we try takes two weeks to send anyone…"
          required
        />
      </div>

      <button className="btn btn--fill btn--block" type="submit">
        Send and open my email client
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      <p className="fnote">
        This form opens your email client with the details prefilled. Nothing you type is stored on this site.
      </p>
    </form>
  );
}
