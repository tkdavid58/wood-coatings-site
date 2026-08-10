import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🪵
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Wood Coatings Catalogue
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse
          </Link>
          <Link
            href="/admin"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
