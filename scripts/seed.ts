import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { NewProduct } from "../src/lib/types";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "wood-coatings.db");
const SEED_PATH = path.join(process.cwd(), "data", "seed-products.json");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL,
    use_cases TEXT NOT NULL DEFAULT '',
    sheen TEXT NOT NULL DEFAULT '',
    application_method TEXT NOT NULL DEFAULT '',
    coats_recommended TEXT NOT NULL DEFAULT '',
    coverage TEXT NOT NULL DEFAULT '',
    dry_time_touch TEXT NOT NULL DEFAULT '',
    dry_time_recoat TEXT NOT NULL DEFAULT '',
    dry_time_cure TEXT NOT NULL DEFAULT '',
    voc_content TEXT NOT NULL DEFAULT '',
    thinner_cleanup TEXT NOT NULL DEFAULT '',
    surface_prep TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    sku TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const seedProducts: NewProduct[] = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));

const insert = db.prepare(`
  INSERT INTO products (
    name, brand, type, use_cases, sheen, application_method,
    coats_recommended, coverage, dry_time_touch, dry_time_recoat,
    dry_time_cure, voc_content, thinner_cleanup, surface_prep,
    description, sku, source_url
  ) VALUES (
    @name, @brand, @type, @use_cases, @sheen, @application_method,
    @coats_recommended, @coverage, @dry_time_touch, @dry_time_recoat,
    @dry_time_cure, @voc_content, @thinner_cleanup, @surface_prep,
    @description, @sku, @source_url
  )
`);

const resetAndSeed = db.transaction((products: NewProduct[]) => {
  db.exec("DELETE FROM products;");
  db.exec("DELETE FROM sqlite_sequence WHERE name = 'products';");
  for (const product of products) {
    insert.run(product);
  }
});

resetAndSeed(seedProducts);

console.log(`Seeded ${seedProducts.length} products into ${DB_PATH}`);
db.close();
