export interface Product {
  id: number;
  name: string;
  brand: string;
  type: string;
  category: string;
  use_cases: string;
  sheen: string;
  application_method: string;
  coats_recommended: string;
  coverage: string;
  dry_time_touch: string;
  dry_time_recoat: string;
  dry_time_cure: string;
  voc_content: string;
  thinner_cleanup: string;
  surface_prep: string;
  description: string;
  sku: string;
  source_url: string;
  created_at: string;
}

export type NewProduct = Omit<Product, "id" | "created_at">;

export interface ProductSearchFilters {
  q?: string;
  brand?: string;
  category?: string;
  useCase?: string;
}
