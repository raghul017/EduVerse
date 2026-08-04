import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * SECTION 8 -- marquee band.
 * --dark ground, --accent text, short declarative statements separated by a
 * dot, scroll-scrubbed, pauses on hover.
 *
 * LIME AS TEXT IS LEGAL HERE. On --dark (#34342E) the accent measures
 * 10.14:1. It is only banned as text on light surfaces, where it is 1.01:1.
 * HARD RULE 1 permits exactly this case.
 *
 * MARQUEE BUDGET: this is the page's one desktop marquee. Section 4's logo
 * strip, which carried the only other one, has been deleted, so at any
 * viewport exactly one marquee exists (skill 5: max one per page).
 *
 * SCRUB, NOT LOOP: the band's position is tied to scroll rather than to a
 * timer. A time-based infinite loop is ambient decoration; a scrub-linked one
 * responds to the reader and stops when they stop, which is why it survives
 * the "motion must be motivated" test.
 *
 * The old Home.jsx marquee cloned a DOM node on every mount and never removed
 * it, so navigating away and back leaked a copy each time. This one duplicates
 * the list in markup instead, so there is nothing to clean up.
 */

const STATEMENTS = [
  "Sequence over volume",
  "Finish one thing",
  "Resources that were actually read",
  "Progress you can see",
  "Ask at the step you are on",
];

function Row({ ariaHidden = false }) {
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
    >
      {STATEMENTS.map((s) => (
        <span key={s} className="flex items-center whitespace-nowrap">
          <span className="px-lp5 font-body text-lpH2 font-semibold text-lime">
            {s}
          </span>
          {/* Separator. One dot between items, which is the rationed use
              skill 9.F allows, not a dot-delimited metadata pile. */}
          <span aria-hidden="true" className="text-lpH2 text-onDark2/40">
            &middot;
          </span>
        </span>
      ))}
    </div>
  );
}

export default function MarqueeBand() {
  const scope = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      // Reduced motion: no scrub. The band renders static and readable.
      if (reduced) return;

      const track = trackRef.current;

      const tween = gsap.fromTo(
        track,
        { xPercent: 0 },
        {
          xPercent: -50, // the list is duplicated, so -50% lands on the copy
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // Pause on hover. With a scrubbed tween there is no playhead to pause,
      // so the hover state suspends the ScrollTrigger's updates instead and
      // resumes them on leave.
      const st = tween.scrollTrigger;
      const enter = () => st?.disable(false);
      const leave = () => st?.enable(false);
      const el = scope.current;
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      aria-label="What we believe"
      className="overflow-hidden bg-dark py-lp7"
    >
      <div ref={trackRef} className="flex w-max items-center">
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  );
}
