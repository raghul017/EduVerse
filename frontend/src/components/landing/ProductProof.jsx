import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MediaSlot from "./MediaSlot.jsx";

/**
 * SECTION 4 -- product proof.
 *
 * This section exists because the hero shows no product. Moving real proof to
 * position 4, one scroll from the headline, is what makes the typographic hero
 * safe. It replaces the placeholder logo strip, which was six invented
 * monograms doing no work.
 *
 * THE DARK PANEL ON CREAM IS DELIBERATE.
 * The app renders on #0a0a0a and this page is cream. Rather than wait for an
 * app-wide theme migration or crop around the mismatch, the screenshot is
 * framed as a dark product panel inset on the cream ground. This is a standard
 * editorial device: the dark rectangle reads as a window into the software,
 * and the contrast is what makes the product feel like a distinct object
 * rather than a picture pasted onto a page. It also means the screenshot stays
 * correct when the app is eventually migrated, because the frame is doing the
 * work, not a colour match.
 *
 * Panel treatment:
 *   - --dark ground behind the shot so any letterboxing matches the UI
 *   - inset from the section edges, not full-bleed to the viewport, so it
 *     reads as an object with edges
 *   - concentric radii: outer frame lpXl (24px), inner image lpLg (16px),
 *     the 8px difference being the frame padding
 *
 * NO MOCK UI. The slot below is either a real screenshot of the actual
 * generator or a clearly-labelled empty state. It is never a rebuilt or
 * approximated product interface. See skill 4.8 and 9.E.
 */

// TODO: replace with the real capture once frontend/public/media/roadmap-generator.png
// exists. Spec: 1440x900 logical at DPR 2 (2880x1800), Frontend Developer
// roadmap, complete, 2-3 nodes marked done, resource sidebar open, scrolled
// past the header chrome. PNG, max 1.2MB.
const SHOT = "/media/roadmap-generator.png";

export default function ProductProof() {
  const scope = useRef(null);
  const panelRef = useRef(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.fromTo(
        ".lp-proof-enter",
        { autoAlpha: 0, y: reduced ? 0 : 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
        }
      );

      // DO NOT REINTRODUCE PARALLAX HERE while the negative margin is doing
      // the work. The panel used to carry a yPercent scrub. It fights the
      // overlap: a transform on the same axis as the offset makes the peeking
      // slice grow and shrink on scroll, so the hero's bottom edge visibly
      // moves. The overlap already provides the depth the parallax was there
      // to provide, so it was doing the job twice and losing.
      void reduced;
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      aria-labelledby="lp-proof-heading"
      className="relative z-10 bg-canvas pb-section"
    >
      {/* THE PEEK. The panel is pulled up so a slice of it breaks into the
          bottom of the hero viewport. This is the fix for a type-only hero
          reading flat: the cream field gains an edge, the overlap creates real
          depth, and the eye is pulled toward the product, which is the job this
          section already had. It is composition, not decoration, so it works
          just as well while the slot is still an empty labelled state.
          The negative margin is a clamp so the slice stays proportional: about
          72px at 360px and 132px at desktop. */}
      <div className="mx-auto -mt-[clamp(72px,11vw,132px)] max-w-lp px-gutter">
        {/* Deliberately NOT a SectionIntro: this section leads with the
            artifact, not with a headline. The caption sits under the panel so
            the product is the first thing the eye lands on after the hero. */}
        <div
          ref={panelRef}
          className="lp-proof-enter overflow-hidden rounded-lpXl bg-dark p-lp2 shadow-[0_24px_70px_-30px_rgba(52,52,46,0.55)]"
        >
          {/* 16:10, matching the 1440x900 capture, so the slot and the asset
              agree and nothing is cropped by surprise. */}
          <MediaSlot
            src={SHOT}
            alt="The EduVerse roadmap generator showing a Frontend Developer path, with completed steps marked and curated resources open for one step."
            slotPath="public/media/roadmap-generator.png"
            note="Real screenshot of the roadmap generator goes here. No mock UI is rendered in its place."
            aspect="aspect-[16/10]"
            className="rounded-lpLg"
            width={2880}
            height={1800}
          />
        </div>

        {/* Caption. Inter, below the 40px display floor. Carries the claim the
            hero deliberately did not make. */}
        <div className="lp-proof-enter mt-lp6 flex flex-col gap-lp2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2
            id="lp-proof-heading"
            className="max-w-[46ch] font-body text-lpH3 font-semibold text-primaryText"
          >
            This is the actual output, not a mockup.
          </h2>
          <p className="font-body text-lpSm text-mutedText">
            Generated in about ninety seconds
          </p>
        </div>
      </div>
    </section>
  );
}
