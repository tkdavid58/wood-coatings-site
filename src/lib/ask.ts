import { searchProducts } from "./db";
import type { Product } from "./types";

export type FieldKey = keyof Pick<
  Product,
  | "sheen"
  | "application_method"
  | "coats_recommended"
  | "coverage"
  | "dry_time_touch"
  | "dry_time_recoat"
  | "dry_time_cure"
  | "voc_content"
  | "thinner_cleanup"
  | "surface_prep"
  | "sku"
  | "use_cases"
  | "category"
  | "brand"
  | "description"
>;

export interface FieldAnswer {
  key: FieldKey;
  label: string;
}

export type FieldMatch =
  | { kind: "single"; field: FieldAnswer }
  | { kind: "drying_time" }
  | { kind: "general" };

const FIELD_RULES: { test: RegExp; match: FieldMatch }[] = [
  {
    test: /touch.?dry|dry.?to.?touch/i,
    match: { kind: "single", field: { key: "dry_time_touch", label: "Dry time (touch)" } },
  },
  {
    test: /re.?coat/i,
    match: { kind: "single", field: { key: "dry_time_recoat", label: "Dry time (recoat)" } },
  },
  {
    test: /full.?cure|cure.?time|fully.?cured|\bcure\b/i,
    match: { kind: "single", field: { key: "dry_time_cure", label: "Cure time (full)" } },
  },
  { test: /dry(ing)?[\s-]*time|how long.*dry|\bdrying\b/i, match: { kind: "drying_time" } },
  {
    test: /coverage|spread.?rate|how much.*need/i,
    match: { kind: "single", field: { key: "coverage", label: "Coverage" } },
  },
  { test: /\bvoc\b/i, match: { kind: "single", field: { key: "voc_content", label: "VOC content" } } },
  {
    test: /sheen|gloss.?level|finish.?level/i,
    match: { kind: "single", field: { key: "sheen", label: "Sheen" } },
  },
  {
    test: /application method|how (do|to) i apply|apply(ing)?|spray or brush/i,
    match: { kind: "single", field: { key: "application_method", label: "Application method" } },
  },
  {
    test: /how many coats|number of coats|coats?.?recommended/i,
    match: { kind: "single", field: { key: "coats_recommended", label: "Recommended coats" } },
  },
  {
    test: /thinner|clean.?up|dilut|mix ratio|hardener|catalys/i,
    match: { kind: "single", field: { key: "thinner_cleanup", label: "Thinner / cleanup" } },
  },
  {
    test: /surface prep|sanding|how to prepare|prep(aration)?\b/i,
    match: { kind: "single", field: { key: "surface_prep", label: "Surface preparation" } },
  },
  {
    test: /\bsku\b|product code|part number/i,
    match: { kind: "single", field: { key: "sku", label: "SKU" } },
  },
  {
    test: /use.?case|used for|suitable for|what.*for\b/i,
    match: { kind: "single", field: { key: "use_cases", label: "Use cases" } },
  },
  {
    test: /category|what kind|what type/i,
    match: { kind: "single", field: { key: "category", label: "Category" } },
  },
  {
    test: /\bbrand\b|who makes|manufacturer/i,
    match: { kind: "single", field: { key: "brand", label: "Brand" } },
  },
  {
    test: /description|tell me about|what is\b/i,
    match: { kind: "single", field: { key: "description", label: "Description" } },
  },
];

const STOPWORDS =
  /\b(what'?s|whats|what is|what are|tell me|about|please|for|of|the|on|is|are|does|do|i|need|how much|how many|how long|thanks?|you)\b/gi;

const DOMAIN_WORDS =
  /\b(drying?|dry|time|touch|recoat|re-coat|cure|cured|coverage|spread|rate|voc|sheen|gloss|finish|level|application|method|apply|applying|spray|brush|coats?|recommended|thinner|cleanup|clean-up|dilute|mix|ratio|hardener|catalyst|catalyse|surface|prep|preparation|sanding|sku|code|part|number|use|case|cases|used|suitable|category|kind|type|brand|manufacturer|description)\b/gi;

function detectField(question: string): FieldMatch {
  for (const rule of FIELD_RULES) {
    if (rule.test.test(question)) return rule.match;
  }
  return { kind: "general" };
}

function extractProductQuery(question: string): string {
  let q = question.replace(/[?!.]/g, " ");
  q = q.replace(STOPWORDS, " ");
  q = q.replace(DOMAIN_WORDS, " ");
  return q.replace(/\s+/g, " ").trim();
}

function normalize(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function isCodeLikeToken(word: string): boolean {
  const bare = word.replace(/[^A-Za-z0-9]/g, "");
  return bare.length >= 3 && /[A-Za-z]/.test(bare) && /[0-9]/.test(bare);
}

function findMatchingProducts(productQuery: string): Product[] {
  const normQuery = normalize(productQuery);
  if (!normQuery) return [];

  const all = searchProducts({});

  // 1. The whole query contains a full product SKU (e.g. "Renner YL-M602/C02 drying time")
  const fullSkuMatches = all.filter((p) => p.sku && normQuery.includes(normalize(p.sku)));
  if (fullSkuMatches.length > 0) {
    // Prefer the most specific (longest) SKU match(es) when one SKU is a substring of another
    const maxLen = Math.max(...fullSkuMatches.map((p) => normalize(p.sku).length));
    return fullSkuMatches.filter((p) => normalize(p.sku).length === maxLen);
  }

  // 2. A product-code-shaped token in the query is itself a prefix/substring of a SKU
  //    (e.g. "YL-M641" should match "YL-M641/C02" and "YL-M641/NTR", not every primer)
  const codeTokens = productQuery
    .split(/\s+/)
    .filter(isCodeLikeToken)
    .map(normalize)
    .filter(Boolean);
  if (codeTokens.length > 0) {
    const codeMatches = all.filter((p) => {
      const skuNorm = normalize(p.sku);
      if (!skuNorm) return false;
      return codeTokens.some((token) => skuNorm.includes(token) || token.includes(skuNorm));
    });
    if (codeMatches.length > 0) {
      const maxLen = Math.max(...codeMatches.map((p) => normalize(p.sku).length));
      return codeMatches.filter((p) => normalize(p.sku).length === maxLen);
    }
  }

  // 3. Fall back to loose word overlap against brand + name
  const queryWords = productQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  if (queryWords.length === 0) return [];

  return all.filter((p) => {
    const haystack = `${p.brand} ${p.name}`.toLowerCase();
    const hits = queryWords.filter((w) => haystack.includes(w));
    return hits.length >= Math.max(1, Math.ceil(queryWords.length * 0.6));
  });
}

export interface AskResult {
  question: string;
  productQuery: string;
  fieldMatch: FieldMatch;
  products: Product[];
}

export function answerQuestion(question: string): AskResult {
  const fieldMatch = detectField(question);
  const productQuery = extractProductQuery(question);
  const products = findMatchingProducts(productQuery);
  return { question, productQuery, fieldMatch, products };
}
