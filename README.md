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

New enquiries on both public Hoflings and Mac Studio forms include first-visit and latest campaign/external-referral
attribution, sanitized landing/referrer URLs, UTM tags and click identifiers, Cloudflare IP geolocation, and browser/device
context. `public/lead-context.js` retains a 30-day attribution window across Hoflings subdomains; the shared backend
validates those fields and independently supplies IP geolocation. These are advisory traffic records, not authorization
inputs. The `/admin` inbox and CSV export display the metadata stored in `contacts.attribution` and
`contacts.visitor_context`; historical inquiries retain unknown referral/location data, while existing user agents can
still identify their browser/device. The migration is kept under `supabase/migrations/`.

GA4 property `G-3WWJK4WL51` is loaded on public `hoflings.com` / `www.hoflings.com` pages by `public/analytics.js` and
on `mac-studio.hoflings.com` by its hostname-scoped head snippet. GTM `GTM-KZRMP3JV` remains Mac Studio-only. Neither
script is added to the staff auth/admin shells. Version query strings on shared public scripts should change whenever
those scripts change.

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
address that may sign in or create an account. It accepts a comma-separated
allow-list (`you@gmail.com,alias@gmail.com`) so a mistyped or browser-autofilled
address cannot lock the owner out; each listed address still needs its own
confirmed account in Supabase Auth.

The signup route creates the account through the Supabase admin API rather than
the public signup endpoint: the public endpoint sends a confirmation email, which
burns the project's email rate limit and leaves the account unconfirmed.

Admins can open an inline reply composer in an enquiry and send through `POST /admin/contact-replies`.
The authenticated API loads the recipient from the enquiry, fixes From and Reply-To to `support@hoflings.com`,
and records the message in the backend-only `public.contact_replies` table before contacting SendGrid.
A stable request UUID prevents double-clicks and retries from sending the same reply twice. Successful SendGrid
acceptance marks the enquiry contacted and appears in reply history; it is not a delivery receipt. Uncertain sends
are held for review instead of automatically retried. RLS with no public/authenticated grants intentionally keeps
reply bodies available only through the admin API. No inbound email synchronization is implemented.

## AI reply drafts

After signing in at `/auth`, use `/admin#settings` to save or replace an OpenAI API key, select a Responses API model
(default `gpt-5-mini`), or disable AI drafting. The key is encrypted in Supabase Vault. A dedicated private schema holds
only the Vault secret ID and model settings; service-role-only RPC wrappers let the backend read it. Settings HTTP
responses return configuration status, never the key. Staff auth/admin pages do not load the public tracking scripts.
The Settings key field is intentionally cleared after saving; it is only for replacements. A status card shows whether
the encrypted key is on file and the last settings save time. Each save is read back from Vault before success is
reported, and Recheck saved status verifies persistence without revealing the key or making a billable OpenAI call.

`POST /admin/ai-reply` authenticates the admin, loads the selected inquiry and up to three recent sent replies, and calls
the OpenAI Responses API with `store: false`. It does not include visitor IP/device/geolocation metadata and never sends
email. Generate with AI replaces the textarea instructions with the generated body; failures preserve the original
instructions and Undo restores them after a successful replacement. Sending remains a separate explicit SendGrid action.

Password reset relies on Supabase's built-in email service, which on the free
plan only sends to project members and is heavily rate-limited. Configure a
custom SMTP provider for Supabase Auth before relying on `/auth/forgot`.

### Admin two-factor login

`/auth` now requires Supabase TOTP MFA (compatible with Google Authenticator). After a password sign-in, new administrators scan a QR code and verify its six-digit code before opening the inbox. Existing enrolled administrators enter their authenticator code. The first-factor cookie is HTTP-only and lasts ten minutes; verification replaces it with the Supabase AAL2 session. Every admin API validates the session with Supabase and requires AAL2. Restrictive database policies also protect inquiry and reply access.

Authenticator setup secrets are shown only during enrollment, are never logged, and responses are not cached. Abandoned unverified enrollments can be restarted; verified factors cannot be removed through this endpoint. If an administrator loses access to their authenticator, the project owner must verify their identity and reset that user's MFA factor through Supabase Auth administration. Password reset alone does not bypass MFA.

Both main-site inquiries and Mac Studio quote requests notify `support@hoflings.com` through the existing SendGrid integration, alongside configured notification recipients, with duplicate addresses removed.

### Lead conversion measurement

The Mac Studio rental form fires Google Ads conversion `AW-18587735600/vo7FCPmc_rwdELCsqZ9F` only after `/rental-quotes` returns a successful saved inquiry ID. The ID is sent as the conversion transaction ID for deduplication. Honeypot responses, form clicks, failed saves and validation failures are not measured. This destination is the Google Ads action “Submit lead form (1)” (conversion type ID 7912525433), with primary optimization, One conversion per ad interaction and a default USD 1 lead value. The previous action is no longer fired by the site.

Both public forms also send GA4 `generate_lead` to `G-3WWJK4WL51`, without names, email addresses, phone numbers or message contents. Google Ads initialization and conversion events remain restricted to `mac-studio.hoflings.com`. Local previews never load production tracking. Ad blockers and browser privacy controls may prevent browser-side measurement; Google Ads may take up to 48 hours to show newly recorded conversions.
