# hoflings.com

Marketing site for **Hoflings Ltd** — fully automated AI recruiting and onboarding,
plus HR services, for transportation, shipping and delivery operators in the US and Canada.

## Stack

- Vite + React 18
- GSAP / ScrollTrigger + Lenis for motion
- Three.js for the freight-network hero
- Plain CSS with a token layer (`src/styles/global.css`) driving a day/night theme

## Commands

```bash
npm install        # install
npm run dev        # dev server
npm run build      # build to dist/
npm start          # serve dist/ with the production static server
```

## Structure

```
index.html services.html platform.html industries.html
hrbridge.html about.html contact.html privacy.html terms.html
src/
  main.jsx          router (reads document.body.dataset.page)
  lib/              theme.js, motion.js, scene.js
  data/content.js   all copy, sourced figures and citations
  components/       Bits, Hero, Parts, Pipeline, Icons, Legal
  pages/            one module per page
  styles/global.css token layer + day/night palette
server.js           dependency-free static server used by the host
```

## Hosting

The repository is the single source of truth for every host:

- **Railway** — project `hoflings.com`, service `hoflings.com`, source repo
  `ampmobile/hoflings.com` (branch `main`, auto-deploy on push). Builds with
  `npm ci --include=dev && npm run build`, starts with `npm start` on `$PORT`
  (default 8080). The `--include=dev` flag is required because Railway builds with
  `NODE_ENV=production`, which would otherwise strip Vite from `node_modules`.
  Public domain: `hoflingscom-production.up.railway.app`.
- **Cloudflare Pages** — build command `npm run build`, output directory `dist`.
- **Node** — pinned to 22 via `.node-version`.

## Content and sourcing

Every market figure on the site carries a named source and link; the source list lives
at the bottom of `src/data/content.js` and renders on the relevant pages.

## Theme

Day and night are the same token layer with different values (`[data-theme="day"]`).
The theme is stored in `localStorage` under `hof-theme` and follows the OS
`prefers-color-scheme` until a visitor makes an explicit choice.

## Legal

Hoflings Ltd, 300 Main Street, Madison, NJ 07940. `support@hoflings.com`
