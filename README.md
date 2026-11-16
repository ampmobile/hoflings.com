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
  `ampmobile/hoflings.com` (branch `main`, auto-deploy on push). Nixpacks runs the
  install step with `NODE_ENV=development` (set in `railway.json`) so Vite is present,
  and the build command is only `npm run build`. Running a second `npm ci` inside the
  build command fails with `EBUSY` while npm removes `node_modules/.cache`, so the
  install is left to Nixpacks. The runtime starts with `npm start` on `$PORT`
  (default 8080). Public domain: `hoflingscom-production.up.railway.app`.
- **Cloudflare Pages** — project `hoflings-com`, production branch `main`, build
  command `npm run build`, output directory `dist`, `NODE_VERSION=22`.
  Live at `hoflings-com.pages.dev` (Pages 308-redirects `.html` paths to extensionless).
- **Cloudflare DNS** — zone `hoflings.com` (Free plan) in the
  `Murat9mega@gmail.com's Account` (account id `8b050f696532858f4cbb677da2940527`).
  Assigned nameservers `bethany.ns.cloudflare.com` and `damon.ns.cloudflare.com`;
  the registrar is Namecheap, where `dns1.registrar-servers.com` and
  `dns2.registrar-servers.com` were deleted and DNSSEC turned off. The zone is
  active and `hoflings.com` and `www.hoflings.com` are attached to the Pages
  project as proxied CNAMEs to `hoflings-com.pages.dev`.
  Existing mail records (privateemail.com MX/SRV, SPF TXT) were left untouched so
  mail keeps working across the nameserver change.
- **Supabase** — project `hoflings.com` under `ammobile1111@gmail.com's Org`
  (org id `jvoyfwptndxjtlodllay`), project ref `wepbxrgugqctotczeamu`,
  region `us-east-1`, API URL `https://wepbxrgugqctotczeamu.supabase.co`.
  No GitHub repository is connected to it yet.
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

## Admin backend

The site ships a small backend that runs on both hosts (Cloudflare Pages Functions
and the Node host) from one shared core, `functions/_shared/core.js`. There are no
new npm dependencies — Supabase and SendGrid are called with plain `fetch`.

| Route | Method | Purpose |
| --- | --- | --- |
| `/contacts` | POST | Accept a site enquiry, store it, notify, auto-reply |
| `/auth/login` | POST | Sign in, sets the `hof_admin` httpOnly cookie |
| `/auth/signup` | POST | Create the admin account (admin email only) |
| `/auth/logout` | POST | Clear the session |
| `/auth/session` | GET | Current session state |
| `/auth/forgot` | POST | Start a password reset |
| `/auth/reset` | POST | Finish a password reset |
| `/admin/contacts` | GET/PATCH/DELETE | Read, update and delete enquiries |

- **Storage** — Supabase Postgres, table `public.contacts`. Row Level Security is
  on; only the admin address may read. Inserts and deletes use the service role
  key server-side only, so the browser never sees it.
- **Auth** — Supabase Auth. The session is a Supabase access token stored in an
  httpOnly cookie, so no token is ever exposed to page JavaScript.
- **Email** — SendGrid REST API. Every new enquiry sends a notification to
  `CONTACT_TO_EMAIL` and an auto-reply to the sender. If SendGrid fails the
  enquiry is still saved and the request still succeeds; the row keeps
  `notified = false` so it can be spotted later.

Set the variables listed in `.env.example` on the host. `ADMIN_EMAIL` is the only
address that may sign in or create an account.

The signup route creates the account through the Supabase admin API rather than
the public signup endpoint: the public endpoint sends a confirmation email, which
burns the project's email rate limit and leaves the account unconfirmed.

Password reset relies on Supabase's built-in email service, which on the free
plan only sends to project members and is heavily rate-limited. Configure a
custom SMTP provider for Supabase Auth before relying on `/auth/forgot`.
