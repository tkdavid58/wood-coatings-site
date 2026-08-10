# Wood Coatings Catalog

A simple product catalog site for wood coatings (varnishes, stains, oils, lacquers, etc.).
Visitors can search by name, type, or use case and view the full technical data sheet for
each product (drying time, coverage, application method, and more). Products are stored in
a local SQLite database, and a password-protected admin page lets you add new products
without touching any code.

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
  seed-products.json     # starter catalog data, tracked in git
  wood-coatings.db       # generated SQLite file (git-ignored)
scripts/
  seed.ts                # (re)builds the database from seed-products.json
src/
  lib/
    db.ts                 # database connection + queries (search, get by id, insert)
    auth.ts                # admin session / password check
    types.ts               # Product type
  components/               # SearchForm, ProductCard, DataSheetTable, Header, Footer
  app/
    page.tsx                 # home page: search bar, filters, results list
    products/[id]/page.tsx   # product details / technical data sheet
    admin/                   # password-gated page to add products
```

## Database schema

Each product is a row in the `products` table with fields for the catalog listing
(`name`, `brand`, `type`, `use_cases`, `description`) and for the technical data sheet
(`sheen`, `application_method`, `coats_recommended`, `coverage`, `dry_time_touch`,
`dry_time_recoat`, `dry_time_cure`, `voc_content`, `thinner_cleanup`, `surface_prep`, `sku`).
The table is created automatically the first time the app or seed script runs.

## Deploying

### Quick live preview on Vercel

The app detects Vercel automatically (via the `VERCEL` env var it sets) and points the
database at `/tmp` instead of trying to write to the read-only deployment bundle, and the
database auto-seeds with the starter catalog the moment it's created — so it deploys and
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
browsing the catalog, but products added through `/admin` may disappear after a while — this
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
