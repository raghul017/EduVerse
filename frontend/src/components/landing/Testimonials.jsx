import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * SECTION 10 -- dark testimonial carousel.
 *
 * NO FABRICATED TESTIMONIALS. Every quote below is written by us as
 * placeholder copy and every attribution is VISIBLY a placeholder. Realistic
 * fake names and company affiliations on a live product are deceptive to real
 * users and they survive to production, so the placeholder has to be obvious
 * on sight, not just in a code comment.
 * TODO: replace each entry with a real, attributed, permitted quote, or delete
 * this section. Do NOT swap in plausible-looking names.
 *
 * EB GARAMOND LIVES HERE AND ONLY HERE. It is loaded for this section alone;
 * using it anywhere else on the page breaks the three-voice rule.
 *
 * ACCESSIBILITY:
 *   - the viewport is a labelled group with aria-roledescription="carousel"
 *   - prev/next are real <button>s with aria-labels and are keyboard reachable
 *     in DOM order
 *   - left/right arrow keys move slides when focus is inside the carousel
 *   - slide changes are announced via a polite live region carrying
 *     "Quote N of M", which is the announcement, not the quote text: reading
 *     the whole quote on every press is noise
 *   - each slide is aria-hidden when inactive so screen readers do not walk
 *     through off-screen quotes
 *   - the live region is polite, not assertive: a slide change is not urgent
 *
 * REDUCED MOTION: the slide transition drops to an instant swap. Nothing
 * auto-advances in either mode, so there is no timer to disable.
 */

const QUOTES = [
  {
    id: "q1",
    tint: "sage",
    quote:
      "The roadmap took ninety seconds. The habit took ninety days. Having the order settled was what made the second part possible.",
    // TODO: real attribution, with permission.
    name: "Placeholder Name",
    role: "Role, Company",
  },
  {
    id: "q2",
    tint: "bluePale",
    quote:
      "I had been collecting bookmarks for two years. This was the first thing that told me which one to open on a Tuesday night.",
    name: "Placeholder Name",
    role: "Role, Company",
  },
  {
    id: "q3",
    tint: "blueSoft",
    quote:
      "Asking a question at the step I was actually on, instead of searching and landing three chapters ahead, changed how fast I moved.",
    name: "Placeholder Name",
    role: "Role, Company",
  },
  {
    id: "q4",
    tint: "sand",
    quote:
      "We put four new engineers through the same path. The questions in standup got noticeably better by week two.",
    name: "Placeholder Name",
    role: "Role, Company",
  },
];

// Support colours are permitted as section tints. Mapped explicitly rather
// than interpolated so Tailwind's JIT can see every class it must emit.
const TINTS = {
  sage: "bg-sage",
  bluePale: "bg-bluePale",
  blueSoft: "bg-blueSoft",
  sand: "bg-sand",
};

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const regionId = useId();
  const viewportRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const total = QUOTES.length;
  const go = (next) => setIndex(((next % total) + total) % total);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  return (
    <section
      aria-labelledby="lp-quotes-heading"
      className="overflow-hidden bg-dark py-section"
    >
      <div className="mx-auto max-w-lp px-gutter">
        <p className="font-body text-eyebrow font-semibold uppercase tracking-lpEyebrow text-onDark2">
          What learners say
        </p>

        {/* EB Garamond 500. Section 10 only. */}
        <h2 id="lp-quotes-heading" className="lp-serif mt-lp3 max-w-[20ch] text-onDark">
          Learning is a practice, not a purchase.
        </h2>

        <div
          ref={viewportRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Learner quotes"
          onKeyDown={onKeyDown}
          className="mt-lp8"
        >
          {/* Track. Translated by index; the transition is dropped entirely
              under reduced motion so the swap is instant. */}
          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translate3d(-${index * 100}%, 0, 0)`,
                transition: reduced
                  ? "none"
                  : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {QUOTES.map((q, i) => {
                const active = i === index;
                return (
                  <div
                    key={q.id}
                    className="w-full shrink-0 px-lp1"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Quote ${i + 1} of ${total}`}
                    aria-hidden={!active}
                    // Inactive slides are removed from the tab order so
                    // keyboard users do not tab into off-screen content.
                    inert={!active ? "" : undefined}
                  >
                    <figure
                      className={`flex h-full flex-col justify-between rounded-lpXl p-lp6 sm:p-lp7 ${TINTS[q.tint]}`}
                    >
                      {/* Quote body: Inter, not the serif. The serif is the
                          section headline voice; setting quotes in it too
                          would flatten the hierarchy. Max 3 lines of copy at
                          desktop, per the quote-length rule. */}
                      <blockquote className="max-w-[46ch] font-body text-lpH3 leading-snug text-accentText">
                        {q.quote}
                      </blockquote>

                      <figcaption className="mt-lp6 flex flex-col gap-lp1">
                        {/* Visibly a placeholder. Do not make these look real. */}
                        <span className="font-body text-lpSm font-semibold text-accentText">
                          {q.name}
                        </span>
                        <span className="font-body text-lpXs text-accentText/70">
                          {q.role}
                        </span>
                      </figcaption>
                    </figure>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls. Real buttons, labelled, 44px hit areas. */}
          <div className="mt-lp6 flex items-center gap-lp3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous quote"
              aria-controls={regionId}
              className="flex h-11 w-11 items-center justify-center rounded-lpFull border border-onDark2/40 text-onDark transition-colors duration-200 ease-lpOut hover:border-onDark hover:bg-onDark/10 active:scale-[0.96]"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next quote"
              aria-controls={regionId}
              className="flex h-11 w-11 items-center justify-center rounded-lpFull border border-onDark2/40 text-onDark transition-colors duration-200 ease-lpOut hover:border-onDark hover:bg-onDark/10 active:scale-[0.96]"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>

            <p className="ml-lp2 font-body text-lpSm tabular-nums text-onDark2">
              {index + 1} / {total}
            </p>
          </div>

          {/* Announcement. Carries the position, not the quote text: reading
              the whole quote on every arrow press is noise. Polite, because a
              slide change is not urgent. */}
          <p id={regionId} aria-live="polite" className="sr-only">
            Quote {index + 1} of {total}
          </p>
        </div>
      </div>
    </section>
  );
}
