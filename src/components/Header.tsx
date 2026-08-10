import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Wood Coatings Catalogue
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/ask"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Ask
          </Link>
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
