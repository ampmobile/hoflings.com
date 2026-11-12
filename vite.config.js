import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const pages = ['index', 'services', 'platform', 'industries', 'hrbridge', 'about', 'contact', 'privacy', 'terms'];

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, p === 'index' ? 'index.html' : `${p}.html`])),
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['gsap', 'lenis'],
          three: ['three'],
        },
      },
    },
  },
  server: { port: 5173 },
});
