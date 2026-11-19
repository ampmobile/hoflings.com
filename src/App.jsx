import React, { useEffect } from 'react';
import { initSmoothScroll } from './lib/motion.js';
import { Header, Footer, Chrome, ConsoleBar } from './components/Bits.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Platform from './pages/Platform.jsx';
import Industries from './pages/Industries.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import HrBridge from './pages/HrBridge.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Auth from './pages/Auth.jsx';
import Admin from './pages/Admin.jsx';

const PAGES = {
  home: Home,
  services: Services,
  platform: Platform,
  industries: Industries,
  about: About,
  contact: Contact,
  hrbridge: HrBridge,
  privacy: Privacy,
  terms: Terms,
  auth: Auth,
  admin: Admin,
};

// The console pages are deliberately stripped of the marketing chrome.
const CONSOLE = ['auth', 'admin'];

/**
 * The whole page shell, shared by the client entry and the build-time
 * prerenderer. `page` is passed explicitly when rendering on the server; on
 * the client it falls back to the `data-page` attribute the HTML shell
 * carries, which keeps a single source of truth for which page is which.
 */
export function App({ page: pageProp }) {
  const page =
    pageProp ||
    (typeof document !== 'undefined' ? document.body.dataset.page || 'home' : 'home');
  const Page = PAGES[page] || Home;
  const consolePage = CONSOLE.includes(page);

  useEffect(() => {
    initSmoothScroll();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // Respect deep links (/services#recruiting): land on the anchor
    // instead of forcing the top of the page.
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        requestAnimationFrame(() => {
          const top = el.getBoundingClientRect().top + window.scrollY - 92;
          window.scrollTo(0, Math.max(0, top));
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Chrome />
      {consolePage ? <ConsoleBar /> : <Header page={page} />}
      <main id="main">
        <Page />
      </main>
      {!consolePage && <Footer />}
    </>
  );
}
