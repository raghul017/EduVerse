#!/usr/bin/env node
/**
 * Responsive image build step for the landing page.
 *
 * Takes one high-resolution PNG per slot from public/media/ and emits AVIF,
 * WebP and a downscaled PNG fallback at four widths. The browser picks one via
 * <picture>; see components/landing/ResponsiveImage.jsx.
 *
 * ZERO NEW DEPENDENCIES BY DESIGN. Uses macOS `sips` (AVIF + PNG resize) and
 * Homebrew `cwebp` (WebP), both already present. sharp would be the portable
 * choice but it is a ~10MB native install and this project did not have it.
 * The tradeoff: this script is macOS-only. It degrades safely -- if the tools
 * or the source files are missing it warns and exits 0, so `npm run build`
 * never fails because a designer has not dropped a screenshot in yet.
 *
 * WIDTHS: 720 / 1080 / 1440 / 2160. These key off the `sizes` attribute and
 * DPR (1x, 1.5x, 2x), NOT off measured render dimensions, so a layout tweak
 * does not invalidate them.
 *
 * QUALITY: AVIF q50, WebP q80. Both chosen for UI screenshots, where text
 * edges and 1px borders are the first thing to degrade.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, rmSync } from "node:fs";
import { join, basename, extname } from "node:path";

const SRC_DIR = "public/media";
const OUT_DIR = "public/media/gen";
const WIDTHS = [720, 1080, 1440, 2160];
const AVIF_Q = 50;
const WEBP_Q = 80;

// `which` rather than a shelled-out `command -v`: passing args with
// shell:true triggers a Node deprecation warning and is needlessly injectable.
const have = (cmd) => {
  try {
    execFileSync("which", [cmd], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

if (!existsSync(SRC_DIR)) {
  console.log(`[images] ${SRC_DIR} does not exist yet, nothing to do.`);
  process.exit(0);
}

const sources = readdirSync(SRC_DIR).filter(
  (f) => /\.(png|jpg|jpeg)$/i.test(f) && statSync(join(SRC_DIR, f)).isFile()
);

if (sources.length === 0) {
  console.log("[images] no source images in public/media, nothing to do.");
  process.exit(0);
}

const hasSips = have("sips");
const hasCwebp = have("cwebp");
if (!hasSips) {
  console.warn("[images] `sips` not found (macOS only). Skipping image build.");
  process.exit(0);
}
if (!hasCwebp) {
  console.warn("[images] `cwebp` not found. WebP output will be skipped.");
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const kb = (p) => Math.round(statSync(p).size / 1024);
let emitted = 0;

for (const file of sources) {
  const src = join(SRC_DIR, file);
  const name = basename(file, extname(file));

  for (const w of WIDTHS) {
    const png = join(OUT_DIR, `${name}-${w}.png`);
    // sips resamples on the long edge; our sources are landscape, so width.
    execFileSync("sips", ["-s", "format", "png", "--resampleWidth", String(w), src, "--out", png], { stdio: "ignore" });

    const avif = join(OUT_DIR, `${name}-${w}.avif`);
    execFileSync("sips", ["-s", "format", "avif", "-s", "formatOptions", String(AVIF_Q), png, "--out", avif], { stdio: "ignore" });

    let webpSize = "-";
    if (hasCwebp) {
      const webp = join(OUT_DIR, `${name}-${w}.webp`);
      execFileSync("cwebp", ["-q", String(WEBP_Q), "-quiet", png, "-o", webp], { stdio: "ignore" });
      webpSize = `${kb(webp)}KB`;
      emitted++;
    }
    emitted += 2;
    console.log(`[images] ${name} ${String(w).padStart(4)}w  avif ${String(kb(avif)).padStart(4)}KB  webp ${webpSize.padStart(6)}  png ${String(kb(png)).padStart(4)}KB`);
  }
}

console.log(`[images] ${emitted} files written to ${OUT_DIR}`);
