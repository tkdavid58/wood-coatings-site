import Link from "next/link";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground group-hover:text-accent">
          {product.name}
        </h3>
      </div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">
        {product.type}
      </p>
      {product.brand && (
        <p className="mb-2 text-xs text-muted-foreground">by {product.brand}</p>
      )}
      <p className="mb-3 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {product.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {product.use_cases
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean)
          .slice(0, 3)
          .map((u) => (
            <span
              key={u}
              className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {u}
            </span>
          ))}
      </div>
    </Link>
  );
}
