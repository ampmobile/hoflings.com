import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The server-side build of the same components the browser runs.
 *
 * scripts/prerender.mjs loads this bundle in Node and renders each public
 * route to a string, which is written into the page shell before it is
 * deployed. It is a separate bundle because the client build is split per
 * page and targets the browser; this one targets Node and has one entry.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: '.ssr-build',
    emptyOutDir: true,
    minify: false,
    target: 'node20',
    rollupOptions: {
      output: {
        entryFileNames: 'entry-server.js',
        format: 'es',
      },
    },
  },
});
