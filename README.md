# Rubens Capital Partners — Demo Website

A concept pitch: a faster, sharper, more modern website for **Rubens Capital Partners**,
an independent real estate asset & investment management firm — plus a secure
**institutional investor portal** with a live-feeling portfolio dashboard.

Built with **Next.js (static export)** + **Tailwind CSS v4**, and designed to deploy
to **GitHub Pages** for free.

> ⚠️ **Demo / pitch only.** Not affiliated with or endorsed by Rubens Capital
> Partners. Public content was reconstructed from their website to illustrate a
> redesign. **All investor and portfolio figures in the portal are fictional
> sample data.**

---

## What's inside

### Public marketing site
- **Home** — cinematic hero, headline stats, positioning, strategies, capabilities, portal teaser
- **About** — philosophy, 20-year timeline, full capability set, governance & compliance
- **Strategies** — the four real strategies (Dutch residential, US multifamily, Dutch offices, senior & care housing) with AUM/units and a geographic split
- **Team** — all 16 team members, grouped by leadership / management / investment
- **Contact** — office details, working demo contact form, embedded map

### Investor portal (`/login` → `/portal`)
- **Login** — premium split-screen sign-in (mock, client-side — see below)
- **Dashboard** — portfolio NAV, KPIs (commitment, contributed, distributed, unfunded), NAV-over-time chart, allocation donut, fund summary, recent activity
- **Holdings** — per-fund detail with IRR / MOIC / TVPI and called-capital progress
- **Capital Activity** — filterable capital calls & distributions
- **Documents** — a filterable document vault

### Demo login
Any email + password is accepted. A one-click **"Use demo login"** button is on the
sign-in page:

```
Email:    investor@meridian-pension.com
Password: demo1234
```

The session is a flag stored in `localStorage` — there is **no backend**, which is
exactly what lets the portal run on static hosting like GitHub Pages. (For a real
deployment this would be replaced with proper authentication.)

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build (static export to `out/`):

```bash
npm run build
npx serve out    # preview the exported static site
```

---

## Deploy to GitHub Pages

A ready-to-go GitHub Actions workflow is included at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Create a repo on GitHub and push this project to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push to `main` (or run the workflow manually). The site builds and publishes to
   `https://<your-username>.github.io/<repo-name>/`.

### How the base path is handled
GitHub project sites are served from a sub-path (`/<repo-name>/`), so the workflow
sets `NEXT_PUBLIC_BASE_PATH=/<repo-name>` at build time and
[`next.config.mjs`](next.config.mjs) applies it to all links and assets. Locally the
variable is unset, so everything serves from `/`.

- Using a **user/org site** (`<username>.github.io`)? The workflow detects this and
  uses an empty base path automatically.
- Using a **custom domain**? Set `NEXT_PUBLIC_BASE_PATH` to empty in the build step.

---

## Security notes

This is a static, backend-less site, so the attack surface is small — there is no
server, database, or stored user data. The hardening that *is* applied:

- **Content-Security-Policy** delivered via `<meta http-equiv>` (the only mechanism
  available on GitHub Pages, which cannot send custom response headers). It locks
  `default-src` to self, sets `object-src 'none'`, `base-uri 'self'`, `form-action
  'self'`, and explicitly allow-lists the only external origins the site uses
  (Unsplash images, the Google Maps embed). `script-src`/`style-src` must keep
  `'unsafe-inline'` because a static export emits inline hydration scripts and React
  inline styles with no per-request nonce.
- **Referrer-Policy** `strict-origin-when-cross-origin` (via meta).
- **Google Maps is click-to-load** — no contact with Google (IP, cookies, referrer)
  until the visitor opts in — and the iframe is `sandbox`ed with a minimal referrer
  policy. See the [Privacy Statement](src/app/(marketing)/privacy/page.tsx).
- **Least-privilege CI** — the deploy workflow uses scoped `permissions:` and
  passes inputs via env vars (no shell injection). Dependabot keeps Actions and npm
  dependencies patched.
- **No secrets** in the repo; mock client-side auth only; all portal data is fictional.

**Known GitHub Pages limitations** (not enforceable without a CDN in front):
`HSTS`, `X-Frame-Options` / CSP `frame-ancestors` (clickjacking), and
`X-Content-Type-Options: nosniff` cannot be set, because they require real response
headers that GitHub Pages does not allow. Residual clickjacking risk is negligible
here (the portal gates only fictional sample data). To enforce them, front the site
with a free **Cloudflare** zone and add the headers via a Transform Rule.
`*.github.io` already forces HTTPS, so transport is encrypted by default.

> npm audit may flag `next`/`postcss` advisories — these are SSR / middleware /
> image-optimizer / Server-Actions specific and are **inert for this static export**
> served with no Node runtime.

## Tech

| | |
|---|---|
| Framework | Next.js 15 (App Router, `output: 'export'`) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Fonts | Fraunces (display) + Inter (body), via `next/font` |
| Charts | Hand-rolled SVG (no chart dependency) |
| Hosting | Static — GitHub Pages, Netlify, Vercel, S3, anywhere |

All content lives in [`src/lib/site.ts`](src/lib/site.ts) (marketing) and
[`src/lib/portal.ts`](src/lib/portal.ts) (investor data) — easy to edit in one place.
