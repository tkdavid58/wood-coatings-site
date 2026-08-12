import Link from "next/link";
import type { Product } from "@/lib/types";
import BrandBadge from "./BrandBadge";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
      className="animate-fade-in-up group flex flex-col rounded-xl border border-border/60 bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="mb-4">
        <BrandBadge brand={product.brand} size="lg" />
      </div>
      {product.category && (
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-accent">
          {product.category}
        </span>
      )}
      <h3 className="mb-2 font-semibold text-foreground transition-colors group-hover:text-accent">
        {product.name}
      </h3>
      <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">{product.description}</p>
    </Link>
  );
}
