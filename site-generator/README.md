# LocalSite Builder

Search local businesses by **country → city → sector**, see the **5 best-matching results**,
pick one, and watch a **10-stage pipeline** research it, pull brand imagery, and generate a
demo website for it — live progress, live preview, downloadable as a static site.

Runs fully offline out of the box on deterministic mock data (no API keys required). Real data
sources (Google Places, Instagram Graph API) can be wired in behind the same interfaces — see
[Going live with real data](#going-live-with-real-data) below.

## How it works

1. **Search** — enter a country, city, and sector (cafe / restaurant / gym). The app ranks and
   returns the top 5 matching businesses for that area.
2. **Select** — pick one of the 5. A pipeline job is created and starts running immediately.
3. **Pipeline** — 10 sequential stages run against the selected business, each one producing real
   output that feeds the next stage:

   | # | Stage | What it does |
   |---|-------|---------------|
   | 1 | Intake & validation | Validates the business profile has the fields needed to proceed |
   | 2 | Business research | Derives category, price range, specialties, and review sentiment |
   | 3 | Local & competitive context | Scans nearby competitors and positions the business among them |
   | 4 | Brand imagery from Instagram | Pulls a profile photo + recent posts to use as the site's imagery |
   | 5 | Content strategy | Picks the page sections and tone of voice for the sector |
   | 6 | Copywriting | Writes the headline, about copy, services/menu, and testimonials |
   | 7 | Template & palette selection | Chooses a sector-appropriate layout and color palette |
   | 8 | SEO & structured data | Generates meta tags and `schema.org` LocalBusiness JSON-LD |
   | 9 | Page assembly | Renders the final static HTML/CSS demo site from everything above |
   | 10 | Publish preview | Makes the generated site available to preview and download |

4. **Preview & export** — once complete, the demo site renders live in an iframe. Download it as
   a ready-to-host `.zip` (`index.html` + `styles.css`), or open it in a new tab.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**, single codebase for frontend + API routes
- **Tailwind CSS** for the app UI (the *generated* demo sites ship their own plain CSS, so they
  have zero dependency on this app's styling)
- In-memory job store (see [Persistence](#persistence)) — no database required to run this demo
- `archiver` for zipping the generated site for download

## Running it

```bash
cd site-generator
npm install
npm run dev
```

Open `http://localhost:3000`. No environment variables or API keys are needed — the app runs on
built-in mock providers.

```bash
npm run build && npm run start   # production build
npm run typecheck                # tsc --noEmit
```

## Architecture

```
src/
  app/
    page.tsx                       Search form + top-5 results + "generate" action
    jobs/[id]/page.tsx             Live pipeline progress, preview iframe, download
    api/
      search/route.ts              POST { country, city, sector } -> top 5 businesses
      jobs/route.ts                POST { business } -> creates a job, kicks off the pipeline
      jobs/[id]/route.ts           GET job status (polled by the UI every ~900ms)
      jobs/[id]/site/[...path]/    GET generated file (serves the live preview)
      jobs/[id]/download/          GET the generated site as a .zip
  lib/
    types.ts                       Domain model shared by providers, pipeline, and UI
    store.ts                       In-memory job store + the 10 stage definitions
    providers/
      businessSearch.ts            BusinessSearchProvider: Mock + Google Places stub
      instagram.ts                 BrandAssetProvider: Mock + Instagram Graph API stub
    pipeline/
      engine.ts                    Runs all 10 stages in order, persists progress per stage
      stages.ts                    The real per-stage logic (one function per stage)
    templates/
      sectorTemplates.ts           Per-sector (cafe/restaurant/gym) copy templates & palettes
      siteRenderer.ts               Turns research + copy + images + SEO into static HTML/CSS
    mockData/businessGenerator.ts  Deterministic "top 5 nearby businesses" generator
```

### Persistence

Jobs live in an in-memory `Map` (`src/lib/store.ts`), scoped to the Node.js process — fine for
local use or a single-instance demo deployment, but it means jobs are lost on restart and won't
work across multiple server instances. Swap `store.ts` for a real database (Postgres, Redis) if
you need durability or horizontal scaling; every other module only depends on the exported
`createJob` / `getJob` / `saveJob` functions, so that's the one file to change.

### Why mock data by default

- **Business discovery** needs a places/maps API (Google Places, here) that requires billing and
  an API key — not something to hardcode into a shared repo.
- **Instagram imagery**: there is no ToS-compliant way to pull photos from an arbitrary
  third-party Instagram account. The official Instagram Graph API only returns media for a
  business account that has explicitly connected itself and issued an access token — it cannot
  fetch a competitor's or stranger's posts. Scraping Instagram directly violates its Terms of
  Service and isn't implemented here.

So both providers ship as an interface with two implementations: a deterministic **mock**
(default, zero setup) and a **real** one that activates automatically once you provide
credentials — nothing else in the codebase changes.

## Going live with real data

Copy `.env.example` to `.env.local` and fill in what you have:

```bash
# Real business search via Google Places API (Text Search)
GOOGLE_PLACES_API_KEY=...

# Real brand imagery via the official Instagram Graph API — only works for a business
# account the business itself has connected and generated a token for.
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_BUSINESS_ID=...
```

- `getBusinessSearchProvider()` in `src/lib/providers/businessSearch.ts` returns
  `GooglePlacesSearchProvider` when `GOOGLE_PLACES_API_KEY` is set, otherwise the mock.
- `getBrandAssetProvider()` in `src/lib/providers/instagram.ts` returns
  `InstagramGraphApiProvider` when both Instagram variables are set, otherwise the mock.

No other code needs to change — the pipeline and UI consume both through their provider
interfaces.

## Extending

- **New sector** (e.g. "salon", "bakery"): add it to `SECTORS` in `src/lib/types.ts`, add a
  `NAME_PARTS`/`SECTOR_TAGS` entry in `businessGenerator.ts`, and add a `SectorTemplate` in
  `sectorTemplates.ts` (headline/copy templates, services, palette). Everything downstream
  (pipeline, renderer, UI) is sector-agnostic and picks it up automatically.
- **New pipeline stage**: add a key to `StageKey` in `types.ts`, a definition in
  `STAGE_DEFINITIONS` (`store.ts`), and a runner in `STAGE_RUNNERS` (`pipeline/stages.ts`).
- **New template/layout**: add another entry (or a whole new render path) in
  `templates/siteRenderer.ts` and pick it in the `template_selection` stage.

## Known limitations

- In-memory job store only (see [Persistence](#persistence)) — not meant for production/multi-
  instance deployment as-is.
- Mock providers are deterministic per `(country, city, sector)` / business id, not connected to
  real-world data, until real API keys are configured.
- `npm audit` currently flags advisories against `next`/`postcss` with no fix yet released on the
  Next 14.x line at the time of writing; review `npm audit` before any public-facing deployment.
