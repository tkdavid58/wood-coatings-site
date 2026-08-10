import Link from "next/link";
import type { Metadata } from "next";
import { getBrandCounts } from "@/lib/db";
import BrandBadge from "@/components/BrandBadge";

export const metadata: Metadata = {
  title: "Brands - Wood Coatings Catalogue",
  description: "Browse the wood coating manufacturers in the catalogue.",
};

export default function BrandsPage() {
  const brands = getBrandCounts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">
          Browse by brand
        </h1>
        <p className="text-sm text-muted-foreground">
          {brands.length} {brands.length === 1 ? "manufacturer" : "manufacturers"} in the
          catalogue. Pick one to see everything they make.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map(({ brand, count }, index) => (
          <Link
            key={brand}
            href={`/?brand=${encodeURIComponent(brand)}`}
            style={{ animationDelay: `${index * 60}ms` }}
            className="animate-fade-in-up group flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-surface p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <BrandBadge brand={brand} size="xl" />
            <div>
              <div className="font-semibold text-foreground group-hover:text-accent">
                {brand}
              </div>
              <div className="text-xs text-muted-foreground">
                {count} {count === 1 ? "product" : "products"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
