import { getAllBrands, getAllUseCases, searchProducts } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import SearchForm from "@/components/SearchForm";
import ProductCard from "@/components/ProductCard";

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = firstValue(sp.q);
  const brand = firstValue(sp.brand);
  const category = firstValue(sp.category);
  const useCase = firstValue(sp.useCase);

  const results = searchProducts({ q, brand, category, useCase });
  const brands = getAllBrands();
  const useCases = getAllUseCases();

  return (
    <div>
      <div className="border-b border-border bg-gradient-to-b from-surface-muted to-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Find a wood coating
          </h1>
          <p className="mb-8 max-w-xl text-sm text-muted-foreground sm:text-base">
            Search the catalogue by product name, brand, category, or intended use case.
          </p>

          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
            <SearchForm
              q={q}
              brand={brand}
              category={category}
              useCase={useCase}
              brands={brands}
              categories={CATEGORIES}
              useCases={useCases}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-4 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "product" : "products"} found
        </div>

        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">
            No products match your search. Try a different term or clear the filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
