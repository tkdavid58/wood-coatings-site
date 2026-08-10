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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">
          Find a wood coating
        </h1>
        <p className="text-sm text-muted-foreground">
          Search the catalogue by product name, brand, category, or intended use case.
        </p>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-surface-muted p-4">
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

      <div className="mb-4 text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? "product" : "products"} found
      </div>

      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted-foreground">
          No products match your search. Try a different term or clear the filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
