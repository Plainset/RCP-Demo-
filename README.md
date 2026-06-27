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
