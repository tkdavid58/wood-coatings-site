import fs from "node:fs";
import path from "node:path";
import { brandSlug } from "@/lib/brands";

const LOGO_DIR = path.join(process.cwd(), "public", "logos");
const LOGO_EXTENSIONS = ["svg", "png", "webp", "jpg", "jpeg"];

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
  size?: "sm" | "lg";
}) {
  if (!brand) return null;

  const logoSrc = findLogoSrc(brand);

  if (logoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logo files are uploaded at arbitrary sizes, so intrinsic dimensions aren't known ahead of time
      <img
        src={logoSrc}
        alt={brand}
        className={
          size === "lg"
            ? "h-8 w-auto rounded object-contain"
            : "h-5 w-auto rounded object-contain"
        }
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded border border-border bg-surface-muted px-2 py-0.5 font-medium text-muted-foreground ${
        size === "lg" ? "text-sm" : "text-xs"
      }`}
    >
      {brand}
    </span>
  );
}
