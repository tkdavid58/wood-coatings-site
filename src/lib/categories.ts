export const CATEGORIES = [
  "Wood Stain",
  "Varnish & Lacquer",
  "Primer & Sealer",
  "Oil & Wax",
] as const;

export type Category = (typeof CATEGORIES)[number];
