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

const SELECT_CLASSES =
  "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/30";

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
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <label htmlFor="q" className="sr-only">
          Search by name or keyword
        </label>
        <input
          id="q"
          name="q"
          type="text"
          defaultValue={q}
          placeholder="Search by name or keyword, e.g. polyurethane, decking, satin lacquer..."
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="brand" className="mb-1 block text-xs font-medium text-muted-foreground">
            Brand
          </label>
          <select id="brand" name="brand" defaultValue={brand} className={SELECT_CLASSES}>
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
          <select id="category" name="category" defaultValue={category} className={SELECT_CLASSES}>
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
          <select id="useCase" name="useCase" defaultValue={useCase} className={SELECT_CLASSES}>
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
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all hover:bg-accent-hover hover:shadow-md active:scale-[0.98]"
        >
          Search
        </button>
        {hasFilters && (
          <Link
            href="/"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
