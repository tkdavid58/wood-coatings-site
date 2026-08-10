# Wood Coatings Catalogue

A simple product catalogue site for wood coatings (varnishes, stains, oils, lacquers, etc.).
Visitors can search by name, brand, category, or use case, browse by manufacturer on the
Brands page, ask a direct question on the Ask page (e.g. "Renner YL-M602 drying time"), and
view the full technical data sheet for each product (drying time, coverage, application
method, and more). Products are stored in a local SQLite database, and a password-protected
admin page lets you add new products without touching any code. Light and dark themes are
both supported, following the visitor's system preference by default with a manual toggle in
the header.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [SQLite](https://sqlite.org) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — a single file database, no server to run

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The database auto-seeds with the starter
products the first time it's created, so this alone is enough to get going. Run
`npm run db:seed` any time you want to reset the database back to that starter set (e.g. after
testing the admin form).

### Admin password

Copy `.env.example` to `.env.local` and set your own password:

```bash
cp .env.example .env.local
```

```
ADMIN_PASSWORD=pick-something-only-you-know
```

Then visit `/admin` to log in and add products. Without a `.env.local`, the password
defaults to `changeme` — fine for local testing, but change it before deploying anywhere
public.

## Adding products

There are two ways to add new products:

1. **Admin page (recommended).** Go to `/admin`, log in with `ADMIN_PASSWORD`, and fill in
   the "Add a product" form. New products appear in search results immediately.
2. **Seed file.** Add an entry to `data/seed-products.json` (matches the shape of the
   existing entries) and re-run `npm run db:seed`. Note this **replaces** all rows in the
   database with the contents of the seed file, so use it for bulk/initial data rather than
   ad-hoc additions once you have real products added through the admin page.

## Project structure

```
data/
  seed-products.json     # starter catalogue data, tracked in git
  wood-coatings.db       # generated SQLite file (git-ignored)
public/
  logos/                  # brand logo images (see "Brand logos" below)
scripts/
  seed.ts                # (re)builds the database from seed-products.json
src/
  lib/
    db.ts                 # database connection + queries (search, get by id, insert)
    auth.ts                # admin session / password check
    categories.ts           # fixed list of filterable coating categories
    brands.ts               # brand name -> URL-safe slug helper (used to find logo files)
    ask.ts                  # rule-based natural-language question parser (see "Ask" below)
    types.ts                # Product type
  components/               # SearchForm, ProductCard, BrandBadge, ThemeToggle, AskAnswer, DataSheetTable, Header, Footer
  app/
    page.tsx                 # home page: search bar, filters, results list
    brands/page.tsx           # brand directory (logos + product counts)
    ask/page.tsx               # "Ask a question" page
    products/[id]/page.tsx   # product details / technical data sheet
    admin/                   # password-gated page to add products
```

## Ask

`/ask` lets visitors type a question like "Renner YL-M602 drying time" or "VOC content of
Cetol HLS Plus" and get a direct answer. This is **not** an AI model — it's a small rule-based
parser (`src/lib/ask.ts`) that:

1. Matches keywords in the question against a fixed list of known spec fields (drying time,
   coverage, VOC, sheen, application method, coats, thinner/cleanup, surface prep, SKU, use
   cases, category, brand, description).
2. Strips those keywords plus common filler words out of the question, and treats what's left
   as the product being asked about.
3. Matches that remainder against product SKUs and names already in the database — exact/
   partial product codes are tried first (so "YL-M641" correctly narrows to just the two
   YL-M641 variants rather than every Renner primer), falling back to a looser word-overlap
   match on the product name.

If several products match, it asks which one you meant instead of guessing. If a recognised
field is blank for the matched product, it says so and links to the official datasheet rather
than inventing an answer. Because it's keyword-based rather than a real language model, it
only understands phrasing close to the field names it knows about — add more patterns to the
`FIELD_RULES` list in `ask.ts` to broaden what it recognises. Swapping this for a real AI
model later (e.g. the Anthropic API) is possible but would need an API key and has a
per-query cost — the current version is free to run indefinitely.

## Database schema

Each product is a row in the `products` table with fields for the catalogue listing
(`name`, `brand`, `type`, `category`, `use_cases`, `description`) and for the technical data
sheet (`sheen`, `application_method`, `coats_recommended`, `coverage`, `dry_time_touch`,
`dry_time_recoat`, `dry_time_cure`, `voc_content`, `thinner_cleanup`, `surface_prep`, `sku`).
The table is created automatically the first time the app or seed script runs.

`type` is a free-text, product-specific description (e.g. "Exterior Wood Stain – Base Coat,
Translucent, Satin") shown on the product's own page. `category` is the small, fixed set used
for the Category filter dropdown — see `src/lib/categories.ts`. When adding a product through
`/admin`, pick the closest existing category (Wood Stain, Varnish & Lacquer, Primer & Sealer,
Oil & Wax, or Additives & Hardeners); add a new one to `categories.ts` only if a product
genuinely doesn't fit any of them, since the filter is only useful while the list stays short.

## Brand logos

Product cards and pages show each brand's logo instead of plain text where one is available.
Drop a logo file into `public/logos/` named after the brand, lowercased with spaces and
punctuation replaced by hyphens (see `src/lib/brands.ts` for the exact rule), e.g.:

```
public/logos/renner.svg
public/logos/sherwin-williams.svg
public/logos/sikkens.svg
public/logos/anker-stuy-coatings.svg
public/logos/icro.svg
```

SVG, PNG, WebP, or JPEG all work. If no matching file is found for a brand, its name is shown
in a plain text badge instead — nothing breaks, it just falls back gracefully.

If a logo is light/white artwork meant for a dark background (common for "reversed" logo
variants), it'll be nearly invisible on our light cards. Add its slug to
`NEEDS_DARK_BACKDROP` in `src/components/BrandBadge.tsx` to render it on a small dark chip
instead — or swap in a colour/dark logo variant if the manufacturer provides one.

## Deploying

### Quick live preview on Vercel

The app detects Vercel automatically (via the `VERCEL` env var it sets) and points the
database at `/tmp` instead of trying to write to the read-only deployment bundle, and the
database auto-seeds with the starter catalogue the moment it's created — so it deploys and
works out of the box, no build step or manual seeding required.

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Choose **Import Git Repository** and select `tkdavid58/wood-coatings-site`.
3. Pick the branch you want to deploy (a Vercel "Preview" deployment for this PR's branch,
   or `main` once it's merged).
4. Under **Environment Variables**, add `ADMIN_PASSWORD` with a password of your choosing
   (skipping this leaves it at the `changeme` default — fine for a quick look, not for
   sharing the link).
5. Click **Deploy**.

**Know before you rely on it:** Vercel's filesystem is read-only outside of `/tmp`, and
`/tmp` doesn't persist between deploys and can be wiped between cold starts. That's fine for
browsing the catalogue, but products added through `/admin` may disappear after a while — this
setup is for a live look, not for real data entry. For that, see the next section.

### Persistent hosting (real usage)

This app stores data in a SQLite file on local disk (`data/wood-coatings.db`), so for actual
use — where products added through `/admin` need to stick around — run it somewhere with a
**persistent filesystem** (a VPS, a Docker container, Render, Railway, Fly.io, etc.):
`npm run build && npm run start`, making sure the `data/` directory persists across
restarts/deploys.

If you'd rather stay on a serverless platform long-term, swap `better-sqlite3` for a hosted
database (e.g. [Turso](https://turso.tech/) or Postgres) — the query logic all lives in
`src/lib/db.ts`, so that's the only file you'd need to change.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` / `npm run start` — production build and start
- `npm run db:seed` — (re)build the database from `data/seed-products.json`
- `npm run lint` — run ESLint
