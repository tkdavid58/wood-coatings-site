import Link from "next/link";
import type { Product } from "@/lib/types";
import type { AskResult } from "@/lib/ask";
import BrandBadge from "./BrandBadge";
import DataSheetTable from "./DataSheetTable";

function FieldValue({
  product,
  fieldKey,
  label,
}: {
  product: Product;
  fieldKey: keyof Product;
  label: string;
}) {
  const value = product[fieldKey];
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-accent">{label}</div>
      <div className="mt-1 text-base text-foreground">
        {value ? (
          value
        ) : (
          <span className="text-sm text-muted-foreground">
            Not listed for this product.
            {product.source_url && (
              <>
                {" "}
                Check the{" "}
                <a
                  href={product.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-hover"
                >
                  official datasheet
                </a>
                .
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AskAnswer({ result }: { result: AskResult }) {
  const { productQuery, fieldMatch, products } = result;

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
        {productQuery ? (
          <>I couldn&apos;t find a product matching &ldquo;{productQuery}&rdquo;. </>
        ) : (
          <>I couldn&apos;t tell which product you meant &mdash; try including its name or product code. </>
        )}
        <Link
          href={`/?q=${encodeURIComponent(productQuery)}`}
          className="text-accent hover:text-accent-hover"
        >
          Try browsing the catalogue instead &rarr;
        </Link>
      </div>
    );
  }

  if (products.length > 1) {
    return (
      <div>
        <p className="mb-3 text-sm text-muted-foreground">
          A few products match &ldquo;{productQuery}&rdquo; &mdash; which one did you mean?
        </p>
        <div className="flex flex-col gap-2">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm transition-colors hover:border-accent"
            >
              <span className="font-medium text-foreground">{p.name}</span>
              <span className="whitespace-nowrap text-xs text-muted-foreground">{p.sku}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const product = products[0];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          {product.category && (
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-accent">
              {product.category}
            </span>
          )}
          <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
          {product.type && <p className="mt-1 text-sm text-muted-foreground">{product.type}</p>}
        </div>
        <BrandBadge brand={product.brand} size="lg" />
      </div>

      {fieldMatch.kind === "single" && (
        <div className="mb-6">
          <FieldValue product={product} fieldKey={fieldMatch.field.key} label={fieldMatch.field.label} />
        </div>
      )}

      {fieldMatch.kind === "drying_time" && (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FieldValue product={product} fieldKey="dry_time_touch" label="Touch dry" />
          <FieldValue product={product} fieldKey="dry_time_recoat" label="Recoat" />
          <FieldValue product={product} fieldKey="dry_time_cure" label="Full cure" />
        </div>
      )}

      {product.description && (
        <p className="mb-6 text-sm leading-relaxed text-foreground">{product.description}</p>
      )}

      <h3 className="mb-2 text-sm font-semibold text-foreground">Full technical data sheet</h3>
      <DataSheetTable product={product} />

      <p className="mt-4 text-sm">
        <Link href={`/products/${product.id}`} className="text-accent hover:text-accent-hover">
          View full product page &rarr;
        </Link>
      </p>
    </div>
  );
}
