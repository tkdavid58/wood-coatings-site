import { getAllTypes, getAllUseCases, searchProducts } from "@/lib/db";
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
  const type = firstValue(sp.type);
  const useCase = firstValue(sp.useCase);

  const results = searchProducts({ q, type, useCase });
  const types = getAllTypes();
  const useCases = getAllUseCases();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">
          Find a wood coating
        </h1>
        <p className="text-sm text-muted-foreground">
          Search the catalog by product name, coating type, or intended use case.
        </p>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-surface-muted p-4">
        <SearchForm q={q} type={type} useCase={useCase} types={types} useCases={useCases} />
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
