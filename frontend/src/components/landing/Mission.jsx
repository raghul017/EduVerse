import { Link } from "react-router-dom";
import SectionIntro from "./SectionIntro.jsx";
import Reveal from "./Reveal.jsx";

/**
 * SECTION 5 -- mission.
 * Eyebrow + oversized headline + CTA on the left, multi-paragraph body column
 * on the right.
 *
 * This is the asymmetric split the brief specifies, and it is the ONLY
 * section on the page that uses this layout family (skill 4.7: a layout
 * family may appear at most once). Section 7 uses image-left/card-right,
 * which is a different family.
 *
 * NOTE ON THE SPLIT-HEADER BAN (skill 4.7): the skill bans "left big headline
 * + right small explainer paragraph" as a SECTION HEADER pattern. This is not
 * that. The right column is the section's actual content, a real multi-
 * paragraph argument with its own CTA on the left, not a floating explainer
 * propping up a headline. The banned version has a tiny paragraph with no
 * other purpose; this column carries the substance of the section.
 *
 * EYEBROW BUDGET: this is eyebrow 2 of 3 permitted across 13 sections
 * (announcement "NEW" is not a section eyebrow; section 4 has none; this is
 * the first true section eyebrow). Sections 6, 7 and 8 deliberately omit one.
 */
export default function Mission() {
  return (
    <section
      aria-labelledby="lp-mission-heading"
      className="bg-canvasAlt py-section"
    >
      <div className="mx-auto max-w-lp px-gutter">
        <div className="grid gap-lp8 lg:grid-cols-12 lg:gap-lp7">
          {/* LEFT: eyebrow, headline, CTA. */}
          <div className="lg:col-span-6 xl:col-span-5">
            <SectionIntro
              eyebrow="Why we exist"
              headline="Most people don't need another course."
              headlineId="lp-mission-heading"
            >
              <Link
                to="/ai-roadmap"
                className="inline-flex items-center justify-center rounded-lpFull bg-lime px-lp6 py-lp4 font-body text-lpSm font-semibold text-accentText transition-transform duration-200 ease-lpOut hover:brightness-[0.97] active:scale-[0.98]"
              >
                Build my roadmap
              </Link>
            </SectionIntro>
          </div>

          {/* RIGHT: the argument. Reveal staggers the paragraphs so they
              arrive in reading order rather than as a block. */}
          <Reveal
            className="flex flex-col gap-lp5 lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7"
            start="top 82%"
          >
            <p className="font-body text-lpLead text-primaryText">
              The problem was never access. There are more free lectures online
              than anyone could finish in a lifetime.
            </p>
            <p className="max-w-measure font-body text-lpBody text-secondaryText">
              What is missing is the order. Which thing first, which thing can
              wait, and how you know a step is actually done. Most people quit
              a subject not because it was too hard but because they could not
              tell whether they were making progress.
            </p>
            <p className="max-w-measure font-body text-lpBody text-secondaryText">
              EduVerse builds the sequence. You say what you want to be able to
              do, and you get a path with real resources attached to every
              step, plus a tutor that has read those resources and can answer
              questions about them.
            </p>
            <p className="max-w-measure font-body text-lpBody text-secondaryText">
              It is not a library. It is the thing that tells you what to open
              next.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
