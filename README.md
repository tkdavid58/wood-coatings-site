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
npm run db:seed   # creates data/wood-coatings.db and loads the starter products
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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

## Deployment notes

This app stores data in a SQLite file on local disk (`data/wood-coatings.db`), so it runs
well on any host with a **persistent filesystem** (a VPS, a Docker container, Render,
Railway, Fly.io, etc.) — just run `npm run build && npm run start` and make sure the `data/`
directory persists across restarts/deploys.

Serverless platforms with ephemeral filesystems (e.g. Vercel's default deployment) will
reset the database on every deploy and won't share writes across instances. If you deploy
there, swap `better-sqlite3` for a hosted database (e.g. [Turso](https://turso.tech/) or
Postgres) — the query logic all lives in `src/lib/db.ts`, so that's the only file you'd need
to change.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` / `npm run start` — production build and start
- `npm run db:seed` — (re)build the database from `data/seed-products.json`
- `npm run lint` — run ESLint
