import { useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * SECTION 3 -- hero. Typographic, no media.
 *
 * DELIBERATE DIVERGENCE FROM THE REFERENCE, recorded so it is not
 * "corrected" later by someone assuming it was an oversight:
 * get-ripe.com opens on a full-bleed video. This does not. The reason is that
 * we have no real footage and no photography of anyone actually learning, and
 * a typographic hero propped up by a stock image is that design's silhouette
 * with nothing in it. Honest divergence beats imitation on borrowed material.
 * Headline-then-product is also the stronger pattern for software: the
 * product proof in section 4 is now one scroll from the headline instead of
 * three screens down.
 * If real footage is ever shot, revisit this: the media version is the
 * reference's composition and it is better WHEN the asset is real.
 *
 * The dead <video> wiring that pointed at /video/hero.webm and .mp4 is gone.
 * Those files never existed, so every visitor was seeing a poster frame around
 * an empty element.
 *
 * HERO STACK DISCIPLINE (skill 4.7): exactly 3 text elements, under the cap
 * of 4. Headline, sub-copy, CTAs. No eyebrow, no trust micro-strip, no
 * tagline below the buttons, no version label. The old hero had 6, including
 * a warning banner, five vendor-name pills and a "Groq Ultra-Fast" strip.
 *
 * The headline is NOT a SectionIntro: it is the page h1 and carries its own
 * scale. Every OTHER section uses SectionIntro.
 *
 * No parallax here now that there is no media. The brief allows parallax on
 * media only, never on text, so a type-only hero simply has none.
 */
export default function Hero({ variant = "short" }) {
  const scope = useRef(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Entrance only. Opacity + y, matching the page-wide Reveal timing.
      gsap.fromTo(
        ".lp-hero-enter",
        { autoAlpha: 0, y: reduced ? 0 : 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    },
    { scope }
  );

  // VARIANT SWITCH, temporary. Set by pages/Home.jsx so both options can be
  // compared at the real route. Collapses to the chosen one once decided.
  //   "tall"  full height, headline scaled up to fill the space
  //   "short" ~74vh, so section 4 arrives sooner
  const tall = variant === "tall";

  return (
    <section
      ref={scope}
      className={`relative flex flex-col justify-center bg-canvas ${
        tall
          ? // Full height. The headline has to genuinely fill it, otherwise
            // the emptiness is visible. lp-display--fill lifts the ceiling
            // from 140px to 200px and drops the max-width so the type spans
            // the column rather than sitting in the middle of it.
            "min-h-[100dvh] pb-[clamp(96px,14vw,180px)] pt-lp8"
          : // Shorter. No media to justify full-bleed, so the hero is sized to
            // its content and section 4 arrives sooner.
            "min-h-[74dvh] pb-[clamp(84px,12vw,150px)] pt-lp7"
      }`}
    >
      <div className="mx-auto w-full max-w-lp px-gutter">
        <h1
          className={`lp-hero-enter lp-display text-primaryText ${
            tall ? "lp-display--fill max-w-[13ch]" : "max-w-[15ch]"
          }`}
        >
          Stop collecting courses. Start finishing one.
        </h1>

        {/* Sub-copy: 18 words, inside the 20-word hero cap. */}
        <p className="lp-hero-enter mt-introSupport max-w-measure font-body text-lpLead text-secondaryText">
          Tell us what you want to learn. You get a roadmap with real
          resources at every step, and a tutor that has read them.
        </p>

        <div className="lp-hero-enter mt-lp6 flex flex-col gap-lp3 sm:flex-row sm:items-center">
          <Link
            to="/ai-roadmap"
            className="inline-flex items-center justify-center rounded-lpFull bg-lime px-lp6 py-lp4 font-body text-lpSm font-semibold text-accentText transition-transform duration-200 ease-lpOut hover:brightness-[0.97] active:scale-[0.98]"
          >
            Build my roadmap
          </Link>
          <Link
            to="/videos"
            className="inline-flex items-center justify-center rounded-lpFull border border-strong px-lp6 py-lp4 font-body text-lpSm font-semibold text-primaryText transition-colors duration-200 ease-lpOut hover:bg-surfaceSunken active:scale-[0.98]"
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = {
  /** TEMPORARY. "tall" = full height with the headline scaled to fill it.
   *  "short" = ~74vh so section 4 arrives sooner. Collapses to one once
   *  the variant is chosen. */
  variant: PropTypes.oneOf(["tall", "short"]),
};
