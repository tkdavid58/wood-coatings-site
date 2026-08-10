import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <h1 className="mb-2 text-2xl font-semibold text-foreground">Product not found</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        The product you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        Back to search
      </Link>
    </div>
  );
}
