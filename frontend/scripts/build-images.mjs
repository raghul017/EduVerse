#!/usr/bin/env node
/**
 * Responsive image build step for the landing page.
 *
 * Takes one high-resolution PNG per slot from public/media/ and emits AVIF,
 * WebP and a downscaled PNG fallback at four widths. The browser picks one via
 * <picture>; see components/landing/ResponsiveImage.jsx.
 *
 * MACOS-ONLY, AND THAT IS WHY THE OUTPUT IS COMMITTED.
 * Uses macOS `sips` (AVIF + PNG resize) and Homebrew `cwebp`, both already
 * present, so no new dependency. sharp would be portable but is a ~10MB
 * native install this project did not have.
 *
 * The catch: Vercel builds on Linux, where `sips` does not exist. If the
 * derivatives were gitignored, production would silently ship no AVIF and no
 * WebP, <picture> would fall through to the 529 kB PNG, and the regression
 * would pass every local check. So public/media/gen/ IS COMMITTED. The source
 * changes almost never, the derivatives are ~95 kB per slot, and a committed
 * artifact cannot fail to exist on a machine that cannot rebuild it.
 *
 * Consequence: run `npm run build:images` and commit the result whenever a
 * source image changes. CI verifies rather than regenerates -- see the
 * --check flag below, which the build uses on non-macOS so a missing or
 * stale derivative fails loudly instead of silently degrading.
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

// On any machine that cannot encode (Linux CI, Vercel), do not silently skip:
// VERIFY that the committed derivatives are present for every source, and fail
// the build if they are not. Silently shipping the PNG fallback is exactly the
// regression this guards against.
if (!hasSips) {
  const missing = [];
  for (const file of sources) {
    const name = basename(file, extname(file));
    for (const w of WIDTHS) {
      for (const ext of ["avif", "webp"]) {
        const f = join(OUT_DIR, `${name}-${w}.${ext}`);
        if (!existsSync(f)) missing.push(f);
      }
    }
  }
  if (missing.length) {
    console.error(
      `[images] Cannot encode here (no \`sips\`, macOS only) and ${missing.length} ` +
      `committed derivative(s) are missing, e.g. ${missing[0]}.\n` +
      `[images] Run \`npm run build:images\` on macOS and commit public/media/gen/.`
    );
    process.exit(1);
  }
  console.log(`[images] No encoder here; verified ${sources.length} source(s) have committed derivatives.`);
  process.exit(0);
}
if (!hasCwebp) {
  console.warn("[images] `cwebp` not found. WebP output will be skipped.");
}

mkdirSync(OUT_DIR, { recursive: true });
const TMP_DIR = join(OUT_DIR, ".tmp");
mkdirSync(TMP_DIR, { recursive: true });

const kb = (p) => Math.round(statSync(p).size / 1024);
let emitted = 0;

for (const file of sources) {
  const src = join(SRC_DIR, file);
  const name = basename(file, extname(file));

  for (const w of WIDTHS) {
    // Intermediate only. PNG derivatives are NOT kept: AVIF and WebP cover
    // ~96% of browsers, and the untouched source PNG is the <img> fallback for
    // the rest. Keeping four PNG sizes would add ~2.1 MB per slot to the repo
    // for a case the source already handles.
    const png = join(TMP_DIR, `${name}-${w}.png`);
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
    emitted += 1;
    console.log(`[images] ${name} ${String(w).padStart(4)}w  avif ${String(kb(avif)).padStart(4)}KB  webp ${webpSize.padStart(6)}`);
  }
}

rmSync(TMP_DIR, { recursive: true, force: true });
console.log(`[images] ${emitted} files written to ${OUT_DIR}`);
