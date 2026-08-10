import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            className="text-accent"
            aria-hidden="true"
          >
            <path
              d="M12 2c0 0-7 8.5-7 13a7 7 0 0 0 14 0c0-4.5-7-13-7-13z"
              fill="currentColor"
            />
            <path
              d="M8.5 15.5a3.5 3.5 0 0 0 3.5 3.5"
              stroke="var(--surface)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Wood Coatings Catalogue
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/brands"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Brands
          </Link>
          <Link
            href="/admin"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Admin
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
