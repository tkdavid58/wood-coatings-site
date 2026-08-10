import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductById } from "@/lib/db";
import DataSheetTable from "@/components/DataSheetTable";
import BrandBadge from "@/components/BrandBadge";

async function loadProduct(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id)) return undefined;
  return getProductById(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  return {
    title: product ? `${product.name} - Wood Coatings Catalogue` : "Product not found",
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const product = await loadProduct(id);
  const sp = await searchParams;
  const justAdded = sp.added === "1";

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to search
      </Link>

      {justAdded && (
        <p className="mb-6 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
          Product added to the catalogue.
        </p>
      )}

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          {product.category && (
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              {product.category}
            </span>
          )}
          <BrandBadge brand={product.brand} size="lg" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {product.name}
        </h1>
        {product.type && (
          <p className="mt-1 text-sm text-muted-foreground">{product.type}</p>
        )}
      </div>

      {product.description && (
        <p className="mb-6 text-sm leading-relaxed text-foreground">{product.description}</p>
      )}

      {product.use_cases && (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {product.use_cases
            .split(",")
            .map((u) => u.trim())
            .filter(Boolean)
            .map((u) => (
              <span
                key={u}
                className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                {u}
              </span>
            ))}
        </div>
      )}

      <h2 className="mb-2 text-sm font-semibold text-foreground">Technical Data Sheet</h2>
      <DataSheetTable product={product} />

      {product.surface_prep && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-foreground">Surface Preparation</h2>
          <p className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-foreground">
            {product.surface_prep}
          </p>
        </div>
      )}

      {product.source_url && (
        <p className="mt-6 text-sm">
          <a
            href={product.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover"
          >
            View official manufacturer datasheet &#8599;
          </a>
        </p>
      )}
    </div>
  );
}
