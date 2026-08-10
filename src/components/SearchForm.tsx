import Link from "next/link";

interface SearchFormProps {
  q: string;
  type: string;
  useCase: string;
  types: string[];
  useCases: string[];
}

export default function SearchForm({ q, type, useCase, types, useCases }: SearchFormProps) {
  return (
    <form method="GET" action="/" className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="q" className="mb-1 block text-xs font-medium text-muted-foreground">
          Search by name, type, or use case
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
      <div className="sm:w-56">
        <label htmlFor="type" className="mb-1 block text-xs font-medium text-muted-foreground">
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={type}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:w-56">
        <label htmlFor="useCase" className="mb-1 block text-xs font-medium text-muted-foreground">
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
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          Search
        </button>
        {(q || type || useCase) && (
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
