import fs from "node:fs";
import path from "node:path";

const LOGO_EXTENSIONS = ["svg", "png", "webp", "jpg", "jpeg"];
const LOGO_CLASSES = "h-12 w-auto object-contain sm:h-16";

function findLogoSrc(name: string): string | null {
  const publicDir = path.join(process.cwd(), "public");
  for (const ext of LOGO_EXTENSIONS) {
    if (fs.existsSync(path.join(publicDir, `${name}.${ext}`))) {
      return `/${name}.${ext}`;
    }
  }
  return null;
}

export default function Logo() {
  const lightSrc = findLogoSrc("logo");
  const darkSrc = findLogoSrc("logo-dark");

  if (!lightSrc) {
    return (
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Wood Coatings Catalogue
      </span>
    );
  }

  if (!darkSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- logo file is uploaded at an arbitrary size, so intrinsic dimensions aren't known ahead of time
      <img src={lightSrc} alt="Symphony Coatings" className={LOGO_CLASSES} />
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- logo file is uploaded at an arbitrary size, so intrinsic dimensions aren't known ahead of time */}
      <img src={lightSrc} alt="Symphony Coatings" className={`${LOGO_CLASSES} logo-theme-light`} />
      {/* eslint-disable-next-line @next/next/no-img-element -- logo file is uploaded at an arbitrary size, so intrinsic dimensions aren't known ahead of time */}
      <img src={darkSrc} alt="Symphony Coatings" className={`${LOGO_CLASSES} logo-theme-dark`} />
    </>
  );
}
