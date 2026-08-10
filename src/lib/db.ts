import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import type { NewProduct, Product, ProductSearchFilters } from "./types";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "wood-coatings.db");

function createConnection(): Database.Database {
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
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

declare global {
  var __woodCoatingsDb: Database.Database | undefined;
}

const db = globalThis.__woodCoatingsDb ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  globalThis.__woodCoatingsDb = db;
}

export function searchProducts(filters: ProductSearchFilters): Product[] {
  const clauses: string[] = [];
  const args: Record<string, string> = {};

  if (filters.q && filters.q.trim()) {
    clauses.push(
      "(name LIKE @q OR brand LIKE @q OR type LIKE @q OR use_cases LIKE @q OR description LIKE @q)"
    );
    args.q = `%${filters.q.trim()}%`;
  }
  if (filters.type && filters.type.trim()) {
    clauses.push("type = @type");
    args.type = filters.type.trim();
  }
  if (filters.useCase && filters.useCase.trim()) {
    clauses.push("use_cases LIKE @useCase");
    args.useCase = `%${filters.useCase.trim()}%`;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const stmt = db.prepare(`SELECT * FROM products ${where} ORDER BY name ASC`);
  return stmt.all(args) as Product[];
}

export function getProductById(id: number): Product | undefined {
  return db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;
}

export function getAllTypes(): string[] {
  const rows = db
    .prepare("SELECT DISTINCT type FROM products ORDER BY type ASC")
    .all() as { type: string }[];
  return rows.map((r) => r.type);
}

export function getAllUseCases(): string[] {
  const rows = db.prepare("SELECT use_cases FROM products").all() as { use_cases: string }[];
  const set = new Set<string>();
  for (const row of rows) {
    for (const part of row.use_cases.split(",")) {
      const trimmed = part.trim();
      if (trimmed) set.add(trimmed);
    }
  }
  return Array.from(set).sort();
}

export function insertProduct(product: NewProduct): number {
  const stmt = db.prepare(`
    INSERT INTO products (
      name, brand, type, use_cases, sheen, application_method,
      coats_recommended, coverage, dry_time_touch, dry_time_recoat,
      dry_time_cure, voc_content, thinner_cleanup, surface_prep,
      description, sku
    ) VALUES (
      @name, @brand, @type, @use_cases, @sheen, @application_method,
      @coats_recommended, @coverage, @dry_time_touch, @dry_time_recoat,
      @dry_time_cure, @voc_content, @thinner_cleanup, @surface_prep,
      @description, @sku
    )
  `);
  const result = stmt.run(product);
  return Number(result.lastInsertRowid);
}

export function countProducts(): number {
  const row = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  return row.count;
}

export default db;
