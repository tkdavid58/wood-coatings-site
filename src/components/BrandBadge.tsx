import fs from "node:fs";
import path from "node:path";
import { brandSlug } from "@/lib/brands";

const LOGO_DIR = path.join(process.cwd(), "public", "logos");
const LOGO_EXTENSIONS = ["svg", "png", "webp", "jpg", "jpeg"];

// Logos supplied as light/white artwork meant for a dark background. Without
// this they'd be nearly invisible on our light cards, so give them a dark
// backdrop instead of falling back to a plain text badge.
const NEEDS_DARK_BACKDROP = new Set(["anker-stuy-coatings"]);

const SIZE_CLASSES = {
  sm: "h-9",
  lg: "h-14",
  xl: "h-20",
} as const;

function findLogoSrc(brand: string): string | null {
  const slug = brandSlug(brand);
  if (!slug) return null;
  for (const ext of LOGO_EXTENSIONS) {
    if (fs.existsSync(path.join(LOGO_DIR, `${slug}.${ext}`))) {
      return `/logos/${slug}.${ext}`;
    }
  }
  return null;
}

export default function BrandBadge({
  brand,
  size = "sm",
}: {
  brand: string;
  size?: "sm" | "lg" | "xl";
}) {
  if (!brand) return null;

  const slug = brandSlug(brand);
  const logoSrc = findLogoSrc(brand);
  const heightClass = SIZE_CLASSES[size];

  if (logoSrc) {
    const img = (
      // eslint-disable-next-line @next/next/no-img-element -- logo files are uploaded at arbitrary sizes, so intrinsic dimensions aren't known ahead of time
      <img src={logoSrc} alt={brand} className={`${heightClass} w-auto object-contain`} />
    );

    if (NEEDS_DARK_BACKDROP.has(slug)) {
      return (
        <span className="inline-flex items-center rounded-lg bg-neutral-900 p-2">{img}</span>
      );
    }

    return img;
  }

  return (
    <span
      className={`inline-flex items-center rounded-md border border-border bg-surface-muted px-2.5 py-1 font-medium text-muted-foreground ${
        size === "sm" ? "text-xs" : "text-sm"
      }`}
    >
      {brand}
    </span>
  );
}
