/**
 * Theme control — night (default art direction) and day.
 *
 * The initial paint is handled by an inline script in each HTML head, which
 * sets `data-theme` before first render so there is never a flash of the
 * wrong mode. This module is the React-side mirror of that state.
 */

const KEY = 'hof-theme';
const NIGHT = 'night';
const DAY = 'day';

export const THEMES = { NIGHT, DAY };

/**
 * Mirrors the intended theme so two quick clicks cannot both read the same
 * "current" value while a transition is still warming up.
 */
let mirror = null;

function systemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return NIGHT;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? DAY : NIGHT;
}

/** Read the theme currently applied to the document. */
export function getTheme() {
  if (mirror) return mirror;
  if (typeof document === 'undefined') return NIGHT;
  const t = document.documentElement.getAttribute('data-theme');
  return t === DAY ? DAY : NIGHT;
}

/** The stored explicit choice, if the visitor has ever made one. */
export function storedTheme() {
  try {
    const t = localStorage.getItem(KEY);
    return t === DAY || t === NIGHT ? t : null;
  } catch (e) {
    return null;
  }
}

/** Apply a theme to the document. Does not animate — see `applyTheme`. */
function paint(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  mirror = theme;

  // Keep the browser chrome in step with the page.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === DAY ? '#FFFFFF' : '#05070C');
}

/**
 * Switch theme, optionally animating the change.
 * Uses the View Transitions API where available so the whole page crossfades.
 */
export function applyTheme(theme, { animate = true, persist = true } = {}) {
  const next = theme === DAY ? DAY : NIGHT;
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const commit = () => {
    paint(next);
    if (persist) {
      try {
        localStorage.setItem(KEY, next);
      } catch (e) {
        /* private mode — the choice simply will not persist */
      }
    }
    document.dispatchEvent(new CustomEvent('hof:theme', { detail: { theme: next } }));
  };

  const canTransition =
    animate &&
    !reduced &&
    typeof document !== 'undefined' &&
    document.startViewTransition &&
    !document.hidden;

  if (canTransition) {
    // The transition callback normally runs on the next frame. If the
    // compositor never delivers one — a background tab, a headless browser,
    // a stalled GPU — the theme must still switch, so a timer commits it.
    let committed = false;
    const run = () => {
      if (committed) return;
      committed = true;
      commit();
    };
    mirror = next;
    try {
      document.startViewTransition(run);
    } catch (e) {
      run();
    }
    setTimeout(run, 150);
  } else {
    commit();
  }
  return next;
}

/** Flip between night and day. */
export function toggleTheme() {
  return applyTheme(getTheme() === DAY ? NIGHT : DAY);
}

/**
 * Align the document with the stored choice (or the system preference when
 * the visitor has never chosen), and keep following the system while they
 * have not made an explicit choice.
 */
export function initTheme() {
  const stored = storedTheme();
  const theme = stored || systemTheme();
  paint(theme);

  if (!stored && typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      // Only follow the system while there is no explicit choice.
      if (!storedTheme()) paint(e.matches ? DAY : NIGHT);
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  return theme;
}
