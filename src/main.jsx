import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { initTheme } from './lib/theme.js';
import { App } from './App.jsx';
import './styles/global.css';

// Align the document with the visitor's stored choice (or the system
// preference). The inline head script has already set the attribute so the
// first paint is correct; this keeps it live and follows OS changes until
// an explicit choice is made.
initTheme();

const root = document.getElementById('root');

// The public pages ship their copy in the served HTML — scripts/prerender.mjs
// renders it at build time with the same components the browser runs. Hydrate
// that markup rather than throwing it away and rendering it again. The console
// pages are client-only, so they still start from an empty root.
if (root.hasChildNodes()) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
