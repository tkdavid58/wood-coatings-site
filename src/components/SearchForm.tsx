import Link from "next/link";

interface SearchFormProps {
  q: string;
  brand: string;
  category: string;
  useCase: string;
  brands: string[];
  categories: readonly string[];
  useCases: string[];
}

export default function SearchForm({
  q,
  brand,
  category,
  useCase,
  brands,
  categories,
  useCases,
}: SearchFormProps) {
  const hasFilters = q || brand || category || useCase;

  return (
    <form method="GET" action="/" className="flex flex-col gap-4">
      <div>
        <label htmlFor="q" className="mb-1 block text-xs font-medium text-muted-foreground">
          Search by name or keyword
        </label>
        <input
          id="q"
          name="q"
          type="text"
          defaultValue={q}
          placeholder="e.g. polyurethane, decking, satin lacquer..."
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="brand" className="mb-1 block text-xs font-medium text-muted-foreground">
            Brand
          </label>
          <select
            id="brand"
            name="brand"
            defaultValue={brand}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="useCase"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            Use case
          </label>
          <select
            id="useCase"
            name="useCase"
            defaultValue={useCase}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="">All use cases</option>
            {useCases.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Search
        </button>
        {hasFilters && (
          <Link
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
