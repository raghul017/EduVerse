import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * SECTION 4 -- logo strip.
 * Eyebrow, grayscale marks, marquee on mobile.
 *
 * PLACEHOLDER MARKS, NOT REAL LOGOS. We have no right to display real company
 * logos and no relationship to claim. These are generated monograms, visibly
 * generic, each labelled as a placeholder in the DOM for screen readers.
 * TODO: replace with real partner logos once partnerships exist, or delete
 * this section entirely. Do not ship invented company names.
 *
 * LOGO-ONLY rule (skill 4.8): marks only, no industry labels underneath.
 *
 * Note this is the page's ONE marquee besides the section-8 band, and the two
 * never appear on screen together. The skill caps marquees at one per page;
 * this one is mobile-only and section 8's is the desktop one, so at any given
 * viewport exactly one marquee exists.
 */

// TODO: placeholder marks. Replace with real partner SVGs or remove.
const MARKS = [
  { id: "pm-1", initials: "AA", shape: "circle" },
  { id: "pm-2", initials: "BB", shape: "square" },
  { id: "pm-3", initials: "CC", shape: "circle" },
  { id: "pm-4", initials: "DD", shape: "square" },
  { id: "pm-5", initials: "EE", shape: "circle" },
  { id: "pm-6", initials: "FF", shape: "square" },
];

function Mark({ initials, shape }) {
  return (
    <div
      className="flex items-center gap-lp3 opacity-55 grayscale transition-opacity duration-300 ease-lpOut hover:opacity-80"
      role="img"
      aria-label={`Placeholder partner mark ${initials}`}
    >
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        {shape === "circle" ? (
          <circle
            cx="15"
            cy="15"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-strong"
          />
        ) : (
          <rect
            x="2.5"
            y="2.5"
            width="25"
            height="25"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-strong"
          />
        )}
      </svg>
      <span className="font-body text-lpH3 font-semibold tracking-tight text-mutedText">
        {initials}
      </span>
    </div>
  );
}

export default function LogoStrip() {
  const scope = useRef(null);

  useGSAP(
    () => {
      const track = scope.current.querySelector("[data-marquee]");
      if (!track) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      // Under reduced motion the strip stays static and simply scrolls
      // natively if it overflows. No infinite loop.
      if (reduced) return;

      // Only animate when the marquee is actually the active layout (mobile).
      const mq = window.matchMedia("(min-width: 768px)");
      let tween;
      const sync = () => {
        tween?.kill();
        gsap.set(track, { xPercent: 0 });
        if (mq.matches) return;
        // The list is duplicated in markup, so travelling -50% lands exactly
        // on the copy and loops seamlessly.
        tween = gsap.to(track, {
          xPercent: -50,
          duration: 22,
          ease: "none",
          repeat: -1,
        });
      };
      sync();
      mq.addEventListener("change", sync);
      return () => {
        mq.removeEventListener("change", sync);
        tween?.kill();
      };
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      aria-labelledby="lp-trusted"
      className="border-b border-subtle bg-canvas py-lp8"
    >
      <div className="mx-auto max-w-lp px-gutter">
        <p
          id="lp-trusted"
          className="font-body text-eyebrow font-semibold uppercase text-mutedText"
        >
          Trusted by learners
        </p>

        {/* Mobile: marquee. Desktop: static row, no animation. */}
        <div className="mt-lp6 overflow-hidden md:overflow-visible">
          <div
            data-marquee
            className="flex w-max items-center gap-lp8 md:w-full md:flex-wrap md:justify-between md:gap-lp6"
          >
            {MARKS.map((m) => (
              <Mark key={m.id} {...m} />
            ))}
            {/* Duplicate for the seamless loop. Hidden from AT and from the
                desktop layout so it is not read or laid out twice. */}
            {MARKS.map((m) => (
              <div key={`${m.id}-dup`} aria-hidden="true" className="md:hidden">
                <Mark {...m} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
