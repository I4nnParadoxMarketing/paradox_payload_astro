# Paradox Marketing — Payload CMS + Astro

Read-only replication of [paradoxmarketing.io](https://paradoxmarketing.io/) using Payload CMS for content blocks and Astro for the frontend. The live WordPress site is **never modified** — content and design were extracted via read-only HTTP fetches.

## Architecture

```
Payload + Astro/
├── payload/     # Payload CMS 3 (Next.js) — admin + REST API on :3000
└── frontend/    # Astro SSR site on :4321
```

### Homepage blocks (matching live site)

| Block | Live site section |
|-------|-------------------|
| `hero` | Hero video + triangle graphic |
| `logoMarquee` | Trusted brands marquee |
| `whatWeDo` | What We Do intro |
| `serviceTriangle` | Interactive Websites / Advertising / CRMs cards |
| `problems` | Common problems grid |
| `metrics` | Website / Advertising / CRM metrics |
| `workWithUs` | What It Looks Like To Work With Us |
| `testimonials` | Clutch reviews carousel |
| `technology` | Tech stack marquees |
| `portfolio` | Our Work Examples |
| `whoWeAre` | Who We Are |
| `insights` | Digital Marketing Insights |

### Content collections (matching live site CPTs)

| Collection | WordPress CPT | Purpose |
|------------|---------------|---------|
| `portfolio` | `portfolio` | Client work / case studies |
| `insights` | `insights` | Blog-style articles |
| `capabilities` | `capabilities` | Service pages (hierarchical) |
| `people` | `prdx-people` | Team members |

### Globals

| Global | Purpose |
|--------|---------|
| `main-menu` | Header navigation (up to 3 levels). Edit in Admin → **Main Menu**. |

Import from the live site with `npm run import:wordpress`. Page blocks can use **Use collection** to pull from these instead of manual arrays.

## Setup

### Prerequisites

- Node.js 22+
- No separate database server required — Payload uses **SQLite** locally (`payload/data/payload.db`)

### Install

```bash
cd "Payload + Astro"
npm install
```

### Payload CMS

```bash
cp payload/.env.example payload/.env
npm run dev:payload
```

Admin: http://localhost:3000/admin

Seed homepage content (after creating an admin user):

```bash
npm run seed
```

Seed / refresh the header navigation from the extracted live-site menu:

```bash
npm run seed:menu
```

Import WordPress CPTs + pages (read-only from paradoxmarketing.io):

```bash
# Stop Payload first to avoid SQLite locks
npm run import:wordpress
```

This imports **Portfolio**, **Insights**, **Capabilities**, **People**, and public **Pages** (as `pageBanner` + `richContent` layouts). Structured pages from `npm run seed` (home, contact-us, our-team, etc.) are left unchanged.

### Astro frontend

```bash
cp frontend/.env.example frontend/.env
npm run dev:frontend
```

Site: http://localhost:4321

The frontend falls back to bundled homepage content when Payload is unavailable, so you can preview the design immediately.

## Design tokens (from live site)

- Primary blue: `#2F77B5`
- Gold CTA: `#EFB155`
- Cyan: `#80CBE2`
- Text: `#323232`
- Header/footer: `#001523`

## Live Preview

When editing a page in Payload admin (`http://localhost:3000/admin`), click **Live Preview** to open the Astro preview iframe at `/preview/{slug}`. Draft content is fetched read-only from the Payload API.

## Inner pages (replicated read-only)

| Route | Live site reference |
|-------|---------------------|
| `/contact-us` | [paradoxmarketing.io/contact-us](https://paradoxmarketing.io/contact-us/) |
| `/our-team` | [paradoxmarketing.io/our-team](https://paradoxmarketing.io/our-team/) |
| `/capabilities` | Capabilities overview |
| `/capabilities/digital-brand-development` | Sample capability detail page |

All copy, images, and CSS values were read from the public live site at `https://paradoxmarketing.io/` — no writes, edits, or deletes were made to the production WordPress installation.
