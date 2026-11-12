import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initSmoothScroll } from './lib/motion.js';
import { initTheme } from './lib/theme.js';
import { Header, Footer, Chrome } from './components/Bits.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Platform from './pages/Platform.jsx';
import Industries from './pages/Industries.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import HrBridge from './pages/HrBridge.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import './styles/global.css';

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
};

function App() {
  const page = document.body.dataset.page || 'home';
  const Page = PAGES[page] || Home;

  useEffect(() => {
    initSmoothScroll();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // Respect deep links (/services.html#recruiting): land on the anchor
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
      <Header page={page} />
      <main id="main">
        <Page />
      </main>
      <Footer />
    </>
  );
}

// Align the document with the visitor's stored choice (or the system
// preference). The inline head script has already set the attribute so the
// first paint is correct; this keeps it live and follows OS changes until an
// explicit choice is made.
initTheme();

createRoot(document.getElementById('root')).render(<App />);
