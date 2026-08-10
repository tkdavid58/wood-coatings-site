import fs from "node:fs";
import path from "node:path";

const HERO_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function findHeroImage(): string | null {
  const publicDir = path.join(process.cwd(), "public");
  for (const ext of HERO_EXTENSIONS) {
    if (fs.existsSync(path.join(publicDir, `hero-bg.${ext}`))) {
      return `/hero-bg.${ext}`;
    }
  }
  return null;
}

export default function HeroBackground() {
  const src = findHeroImage();
  if (!src) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-supplied image, dimensions unknown ahead of time */}
      <img
        src={src}
        alt=""
        className="h-full w-full scale-110 object-cover opacity-60 blur-3xl dark:opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
    </div>
  );
}
