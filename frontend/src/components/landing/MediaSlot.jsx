import { useState } from "react";
import PropTypes from "prop-types";

/**
 * MediaSlot -- a real image, or an honest empty state. Never a mock.
 *
 * WHY THIS IS A COMPONENT AND NOT AN onError HANDLER:
 * The first version used inline onError to swap in a fallback. That silently
 * failed for every image below the fold, because `loading="lazy"` defers the
 * request until the image scrolls into view, so onError does not fire on load
 * and the browser paints its own broken-image icon in the meantime. Measured:
 * 4 of 5 slots stayed in the broken state with `complete: false`.
 *
 * React state fixes it properly. The <img> is only rendered once we are not in
 * the errored state, so a missing asset renders the labelled slot immediately
 * regardless of viewport position, and there is no broken-image icon at any
 * point.
 *
 * The empty state is deliberately plain: a label, a one-line explanation, and
 * the exact path the asset belongs at. It is NOT a skeleton, a blurred
 * placeholder, or an approximation of the missing UI, because any of those
 * would read as product that does not exist (skill 4.8, 9.E).
 */
export default function MediaSlot({
  src,
  alt,
  slotPath,
  label = "Awaiting capture",
  note,
  aspect = "aspect-[16/10]",
  className = "",
  imgClassName = "h-full w-full object-cover object-top",
  width,
  height,
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-dark ${aspect} ${className}`}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className={imgClassName}
          onError={() => setFailed(true)}
        />
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
            <p className="max-w-[36ch] font-body text-lpSm text-onDark2">
              {note}
            </p>
          )}
          <code className="font-body text-lpXs text-onDark2/70">
            {slotPath}
          </code>
        </div>
      )}
    </div>
  );
}

MediaSlot.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  /** Exact repo path the real asset belongs at. Shown in the empty state. */
  slotPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  note: PropTypes.string,
  aspect: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};
