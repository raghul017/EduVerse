import { useRef } from "react";
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
 *
 * WHY THIS HERO IS ~74vh AND NOT FULL HEIGHT.
 * A type-only hero reads flat, and there were two candidate fixes: scale the
 * headline up to genuinely fill a full-height viewport, or shorten the hero so
 * the ProductProof panel breaks into its bottom edge. They turned out to be
 * MUTUALLY EXCLUSIVE, not additive. At 100vh the panel is pushed entirely
 * below the fold, so a full-height hero structurally cannot have a peek.
 * Measured, panel visible in viewport:
 *     tall  903px (1.00vh), h1 164px  ->  peek NOT visible, both viewports
 *     short 735px (0.82vh), h1 121px  ->  peek visible, 132px desktop
 * Short keeps the headline oversized at 121px and buys the cream field an edge
 * plus the product on the first screen.
 * Mobile decided it: at 360px tall gives 4 headline lines with an empty band
 * above them and no peek; short gives 3 lines and a visible panel.
 * If anyone reaches for min-h-[100dvh] here again, the peek in ProductProof
 * silently stops working. The two are coupled.
 */
export default function Hero() {
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

  return (
    <section
      ref={scope}
      // The bottom padding leaves room for ProductProof's negative margin to
      // pull into. Reducing it closes the peek.
      className="relative flex min-h-[74dvh] flex-col justify-center bg-canvas pb-[clamp(84px,12vw,150px)] pt-lp7"
    >
      <div className="mx-auto w-full max-w-lp px-gutter">
        <h1 className="lp-hero-enter lp-display max-w-[15ch] text-primaryText">
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
            className="inline-flex items-center justify-center rounded-lpFull bg-lime px-lp6 py-lp4 font-body text-lpSm font-semibold text-accentText [transition-property:transform,filter] duration-200 ease-lpOut hover:brightness-[0.97] active:scale-[0.96]"
          >
            Build my roadmap
          </Link>
          <Link
            to="/videos"
            className="inline-flex items-center justify-center rounded-lpFull border border-strong px-lp6 py-lp4 font-body text-lpSm font-semibold text-primaryText [transition-property:transform,background-color,border-color] duration-200 ease-lpOut hover:bg-surfaceSunken active:scale-[0.96]"
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
