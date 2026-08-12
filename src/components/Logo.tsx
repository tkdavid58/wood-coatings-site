import fs from "node:fs";
import path from "node:path";

const LOGO_EXTENSIONS = ["svg", "png", "webp", "jpg", "jpeg"];

function findLogoSrc(): string | null {
  const publicDir = path.join(process.cwd(), "public");
  for (const ext of LOGO_EXTENSIONS) {
    if (fs.existsSync(path.join(publicDir, `logo.${ext}`))) {
      return `/logo.${ext}`;
    }
  }
  return null;
}

export default function Logo() {
  const src = findLogoSrc();

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logo file is uploaded at an arbitrary size, so intrinsic dimensions aren't known ahead of time
      <img src={src} alt="Symphony Coatings" className="h-9 w-auto object-contain" />
    );
  }

  return (
    <span className="text-lg font-semibold tracking-tight text-foreground">
      Wood Coatings Catalogue
    </span>
  );
}
