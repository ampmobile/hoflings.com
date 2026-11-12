import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, revealIn, revealChildren, countUp, marquee, magnetic, REDUCED } from '../lib/motion.js';
import { getTheme, toggleTheme } from '../lib/theme.js';
import { Icon, LogoMark } from './Icons.jsx';
import { BRAND, HRBRIDGE, NAV, SOURCES } from '../data/content.js';

/* ------------------------------------------------------------------ */
/* Primitives                                                           */
/* ------------------------------------------------------------------ */

export const Kicker = ({ children, center, mute }) => (
  <span className={`kicker${center ? ' kicker--center' : ''}${mute ? ' kicker--mute' : ''}`}>{children}</span>
);

export const Btn = ({ href = '#', children, variant = 'fill', size = '', magnetic: mag = true, onClick, target, rel }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (mag) magnetic(ref.current, 0.22);
  }, [mag]);
  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      className={`btn btn--${variant}${size ? ` btn--${size}` : ''}`}
    >
      {children}
    </a>
  );
};

export const SecHead = ({ kicker, title, lede, center, children }) => (
  <header className={`sec-head${center ? ' sec-head--center' : ''}`}>
    {kicker && <Kicker center={center}>{kicker}</Kicker>}
    <h2 className="h2" dangerouslySetInnerHTML={{ __html: title }} />
    {lede && <p className="lede">{lede}</p>}
    {children}
  </header>
);

export const Src = ({ k, label }) => {
  const s = SOURCES[k];
  if (!s) return null;
  return (
    <span className="src">
      <Icon name="file" style={{ width: 12, height: 12, stroke: 'currentColor' }} />
      <span>
        {label || 'Source:'}{' '}
        <a href={s.url} target="_blank" rel="noopener noreferrer">
          {s.label}
        </a>
      </span>
    </span>
  );
};

/* A figure with an animated count-up */
export const Fig = ({ value, suffix = '', label, src, className = '' }) => {
  const numRef = useRef(null);
  useEffect(() => {
    if (numRef.current) countUp(numRef.current, value);
  }, [value]);
  return (
    <div className={`fig ${className}`}>
      <div className="fig__v">
        <span ref={numRef}>0</span>
        {suffix && <em>{suffix}</em>}
      </div>
      <div className="fig__l">{label}</div>
      {src && (
        <div className="fig__s">
          <Src k={src} label="" />
        </div>
      )}
    </div>
  );
};

/* Marquee tape of live market data */
export const Tape = ({ items }) => {
  const trackRef = useRef(null);
  useEffect(() => {
    if (trackRef.current) marquee(trackRef.current, 46);
  }, []);
  const row = (k) =>
    items.map((it, i) => (
      <span className="tape__item" key={k + i}>
        <b>{it.v}</b>
        {it.t}
      </span>
    ));
  return (
    <div className="tape">
      <div className="tape__track" ref={trackRef}>
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
};

/* Panel with corner ticks */
export const Panel = ({ idx, title, children, className = '', tick = true }) => (
  <article className={`panel${tick ? ' panel--tick' : ''} ${className}`}>
    {idx && <span className="panel__idx">{idx}</span>}
    {title && <h3>{title}</h3>}
    {children}
  </article>
);

/* Bulleted list inside a panel */
export const Points = ({ items }) => (
  <ul className="panel__list">
    {items.map((t, i) => (
      <li key={i}>
        <span>{t}</span>
      </li>
    ))}
  </ul>
);

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */

export const Header = ({ page }) => {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [theme, setTheme] = useState(getTheme);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The theme can also change from outside the button (system preference
  // following, or a second header instance) — stay in step with the DOM.
  useEffect(() => {
    const onTheme = (e) => setTheme(e.detail.theme);
    document.addEventListener('hof:theme', onTheme);
    return () => document.removeEventListener('hof:theme', onTheme);
  }, []);

  const day = theme === 'day';
  const themeLabel = day ? 'Switch to night mode' : 'Switch to day mode';

  return (
    <header className={`hdr${stuck ? ' hdr--stuck' : ''}`}>
      <div className="wrap hdr__in">
        <a className="logo" href="/" aria-label="Hoflings home">
          <span className="logo__mark">
            <LogoMark />
          </span>
          <span className="logo__type">
            Hofling<span>s</span>
          </span>
        </a>
        <nav className={`nav${open ? ' is-open' : ''}`} id="nav">
          {NAV.map((n) => (
            <a key={n.key} href={n.href} aria-current={page === n.key ? 'page' : undefined} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hdr__act">
          <button
            className="theme-btn"
            onClick={() => toggleTheme()}
            aria-label={themeLabel}
            title={themeLabel}
            type="button"
          >
            <span className="theme-btn__i theme-btn__i--sun">
              <Icon name="sun" />
            </span>
            <span className="theme-btn__i theme-btn__i--moon">
              <Icon name="moon" />
            </span>
          </button>
          <a className="btn btn--line btn--sm" href="/contact.html">
            Talk to us
          </a>
          <a className="btn btn--fill btn--sm" href="/contact.html">
            Book a demo
          </a>
          <button
            className="burger"
            aria-expanded={open}
            aria-controls="nav"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <i />
          </button>
        </div>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

export const Footer = () => (
  <footer className="ftr">
    <div className="wrap">
      <div className="ftr__grid">
        <div className="ftr__brand">
          <a className="logo" href="/">
            <span className="logo__mark">
              <LogoMark />
            </span>
            <span className="logo__type">
              Hofling<span>s</span>
            </span>
          </a>
          <p>
            Fully automated AI recruiting and onboarding, plus HR services, for transportation, shipping and delivery
            companies across the United States and Canada.
          </p>
          <div className="pills">
            <span className="pill">US &amp; Canada</span>
            <span className="pill">DOT &amp; provincial</span>
            <span className="pill">Bilingual screening</span>
          </div>
          <div className="ftr__legal">
            <div>
              <span className="ftr__lbl">Registered entity</span>
              {BRAND.legalName}
            </div>
            <div>
              <span className="ftr__lbl">Registered office</span>
              {BRAND.address.line1}, {BRAND.address.line2}
            </div>
            <div>
              <span className="ftr__lbl">Product</span>
              <a href={HRBRIDGE.url} target="_blank" rel="noopener noreferrer">
                {HRBRIDGE.domain}
              </a>{' '}
              <span className="ftr__note">— operated by {BRAND.legalName}</span>
            </div>
          </div>
        </div>
        <div>
          <h6>Services</h6>
          <ul>
            <li><a href="/services.html#recruiting">AI recruiting</a></li>
            <li><a href="/services.html#onboarding">AI onboarding</a></li>
            <li><a href="/services.html#hr">HR services</a></li>
            <li><a href="/services.html#pricing">Engagement models</a></li>
          </ul>
        </div>
        <div>
          <h6>Industries</h6>
          <ul>
            <li><a href="/industries.html#trucking">Trucking &amp; intermodal</a></li>
            <li><a href="/industries.html#dsp">DSP &amp; delivery</a></li>
            <li><a href="/industries.html#warehouse">Warehousing &amp; 3PL</a></li>
            <li><a href="/industries.html#crossborder">Cross-border</a></li>
          </ul>
        </div>
        <div>
          <h6>Company</h6>
          <ul>
            <li><a href="/about.html">About</a></li>
            <li><a href="/platform.html">Platform</a></li>
            <li><a href="/hrbridge.html">HRBridge</a></li>
            <li><a href="/contact.html">Contact</a></li>
            <li><a href="/contact.html#demo">Book a demo</a></li>
          </ul>
        </div>
      </div>
      <div className="ftr__bot">
        <span>© {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.</span>
        <div>
          <a href="/about.html">Method</a>
          <a href="/privacy.html">Privacy</a>
          <a href="/terms.html">Terms</a>
          <a href="/contact.html">Accessibility</a>
        </div>
      </div>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/* Ambient chrome: grain, custom cursor, scroll rail                   */
/* ------------------------------------------------------------------ */

export const Chrome = () => {
  const curRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    const cur = curRef.current;
    const rail = railRef.current;
    if (!cur) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf;

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cur.classList.add('is-on');
    };
    const over = (e) => {
      const t = e.target;
      cur.classList.toggle('is-lg', !!(t.closest && t.closest('a, button, .cmp tbody tr, .fig, .panel, .bento__c')));
    };
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cur.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });

    if (rail) {
      const onScroll = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        rail.style.width = `${h > 0 ? (window.scrollY / h) * 100 : 0}%`;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      if (rail) window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="cursor" ref={curRef} aria-hidden="true" />
      <div className="rail" ref={railRef} aria-hidden="true" />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Section wrapper that wires its children into the reveal system       */
/* ------------------------------------------------------------------ */

export const Reveal = ({ children, stagger = 0.07, className = '', as: Tag = 'div' }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) revealChildren(ref.current, '[data-rv]', { stagger });
  }, []);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

/* Generic in-view wrapper for a single element */
export const In = ({ children, className = '', y = 26, delay = 0 }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) revealIn(ref.current, { y, delay });
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

/* Line-by-line masked headline reveal */
export const Headline = ({ lines, className = '' }) => {
  const ref = useRef(null);
  useEffect(() => {
    const wrappers = ref.current.querySelectorAll('.rv-line');
    const spans = ref.current.querySelectorAll('.rv-line > span');
    if (REDUCED) {
      wrappers.forEach((e) => e.classList.add('is-in'));
      return;
    }
    gsap.from(spans, {
      yPercent: 105,
      duration: 1.05,
      ease: 'expo.out',
      stagger: 0.09,
      delay: 0.08,
      clearProps: 'transform',
      onStart: () => wrappers.forEach((e) => e.classList.add('is-in')),
      onComplete: () => wrappers.forEach((e) => e.classList.add('is-in')),
    });
  }, []);
  return (
    <h1 ref={ref} className={className}>
      {lines.map((l, i) => (
        <span className="rv-line" key={i}>
          <span dangerouslySetInnerHTML={{ __html: l }} />
        </span>
      ))}
    </h1>
  );
};

export { Icon, LogoMark };
