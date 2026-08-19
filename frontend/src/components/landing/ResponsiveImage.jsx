import { useState } from "react";
import PropTypes from "prop-types";

/**
 * ResponsiveImage -- a real image in three formats, or an honest empty state.
 *
 * Wraps <picture> around the output of scripts/build-images.mjs. That script
 * emits AVIF, WebP and a downscaled PNG at 720/1080/1440/2160 from one source
 * PNG in public/media/. The browser takes the first <source> it understands.
 *
 * WIDTHS KEY OFF `sizes` AND DPR, NOT MEASURED RENDER DIMENSIONS. The four
 * widths cover the sizes attribute at 1x, 1.5x and 2x, so a layout change that
 * shifts the rendered box by tens of pixels does not invalidate them.
 *
 * NO PRELOAD, NO fetchpriority. Deliberate, and not an oversight:
 * LCP counts only what paints in the INITIAL viewport, and only ~132px of the
 * section 4 panel peeks above the fold against a full-width 121px Anton
 * headline. Which of those wins is too close to settle by reasoning.
 * Preloading a non-LCP image actively delays the real LCP element, and with
 * 112KB of self-hosted fonts already on the critical path -- Anton being the
 * face that paints the above-fold headline -- a ~180KB AVIF preload would
 * compete directly with it. Measure with the real asset in place, then decide.
 *
 * The empty state is NEVER a mock, a skeleton or a blurred placeholder: any of
 * those would read as product that does not exist.
 */
const WIDTHS = [720, 1080, 1440, 2160];

export default function ResponsiveImage({
  name,
  alt,
  slotPath,
  sizes,
  label = "Awaiting capture",
  note,
  aspect = "aspect-[16/10]",
  className = "",
  imgClassName = "h-full w-full object-cover object-top",
  width,
  height,
  priority = false,
}) {
  const [failed, setFailed] = useState(false);
  const base = `/media/gen/${name}`;
  const set = (ext) => WIDTHS.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
  // NOTE: public/media/gen/ is COMMITTED, not gitignored. The encoder is
  // macOS-only and Vercel builds on Linux, so a gitignored derivative would
  // silently not exist in production and <picture> would fall through to the
  // full-size PNG. See scripts/build-images.mjs.

  return (
    <div className={`relative overflow-hidden bg-dark ${aspect} ${className}`}>
      {!failed ? (
        <picture>
          <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
          <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
          {/* Fallback is the untouched source PNG, not a derivative. AVIF and
              WebP cover ~96% of browsers; committing four PNG sizes per slot
              would add ~2.1 MB to the repo to serve the remaining few percent
              a file the source already provides. */}
          <img
            src={`/media/${name}.png`}
            alt={alt}
            width={width}
            height={height}
            // priority is wired but unset everywhere until LCP is measured.
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={imgClassName}
            onError={() => setFailed(true)}
          />
        </picture>
      ) : (
        <div
          role="img"
          aria-label={`${label}. ${note || ""}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-lp2 border border-dashed border-onDark2/30 p-lp5 text-center"
        >
          <p className="font-body text-eyebrow font-semibold uppercase tracking-lpEyebrow text-onDark2">
            {label}
          </p>
          {note && (
            <p className="max-w-[36ch] font-body text-lpSm text-onDark2">{note}</p>
          )}
          <code className="font-body text-lpXs text-onDark2/70">{slotPath}</code>
        </div>
      )}
    </div>
  );
}

ResponsiveImage.propTypes = {
  /** Basename of the source in public/media, without extension. */
  name: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  /** Exact repo path the source belongs at. Shown in the empty state. */
  slotPath: PropTypes.string.isRequired,
  /** Required. Without it the browser assumes 100vw and over-fetches. */
  sizes: PropTypes.string.isRequired,
  label: PropTypes.string,
  note: PropTypes.string,
  aspect: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  /** Set only once LCP is measured and this image is proven to be it. */
  priority: PropTypes.bool,
};
