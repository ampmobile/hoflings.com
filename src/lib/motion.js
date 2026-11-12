import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;

/** Boot smooth scrolling + wire it to GSAP. Returns the Lenis instance. */
export function initSmoothScroll() {
  if (REDUCED) {
    document.documentElement.style.scrollBehavior = 'auto';
    return null;
  }
  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Route in-page anchors through Lenis so they clear the fixed header.
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -92, duration: 1.15 });
    history.replaceState(null, '', `#${id}`);
  };
  document.addEventListener('click', onClick);

  return lenis;
}

export function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: -90, duration: 1.2 });
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Reveal children of a container with a stagger.
 * `sel` picks the children to animate.
 */
export function revealChildren(scope, sel = '[data-rv]', opts = {}) {
  const targets = Array.prototype.slice.call(scope.querySelectorAll(sel));
  if (!targets.length) return;
  if (REDUCED) {
    targets.forEach((t) => t.classList.add('is-in'));
    return;
  }
  targets.forEach((t) => t.classList.add('rv'));
  gsap.from(targets, {
    opacity: 0,
    y: opts.y ?? 26,
    duration: 0.85,
    ease: 'power3.out',
    stagger: opts.stagger ?? 0.07,
    clearProps: 'opacity,transform',
    scrollTrigger: { trigger: scope, start: opts.start ?? 'top 82%', once: true },
    onStart: () => targets.forEach((t) => t.classList.add('is-in')),
  });
}

/** Simple fade/rise for a single element. */
export function revealIn(el, opts = {}) {
  if (!el) return;
  if (REDUCED) {
    el.classList.add('is-in');
    return;
  }
  el.classList.add('rv');
  gsap.from(el, {
    opacity: 0,
    y: opts.y ?? 26,
    duration: opts.duration ?? 0.9,
    ease: 'power3.out',
    delay: opts.delay ?? 0,
    clearProps: 'opacity,transform',
    scrollTrigger: { trigger: el, start: opts.start ?? 'top 88%', once: true },
    onStart: () => el.classList.add('is-in'),
  });
}

/** Count a number up when it scrolls into view. */
export function countUp(el, to, opts = {}) {
  const decimals = (String(to).split('.')[1] || '').length;
  if (REDUCED) {
    el.textContent = Number(to).toFixed(decimals);
    return;
  }
  const obj = { v: 0 };
  gsap.to(obj, {
    v: to,
    duration: opts.duration ?? 1.5,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    onUpdate: () => {
      el.textContent = obj.v.toFixed(decimals);
    },
    onComplete: () => {
      el.textContent = Number(to).toFixed(decimals);
    },
  });
}

/** Horizontal marquee that loops seamlessly. */
export function marquee(track, speed = 60) {
  if (!track || REDUCED) return;
  const loop = () => {
    const half = track.scrollWidth / 2;
    if (half <= 0) return;
    gsap.to(track, {
      x: -half,
      duration: half / speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: (x) => `${parseFloat(x) % half}px`,
      },
    });
  };
  loop();
  window.addEventListener('resize', loop);
}

/** Magnetic hover for buttons and cards. */
export function magnetic(el, strength = 0.32) {
  if (!el || REDUCED) return;
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);
}

export { gsap, ScrollTrigger };
