import SectionIntro from "./SectionIntro.jsx";
import Reveal from "./Reveal.jsx";
import MediaSlot from "./MediaSlot.jsx";

/**
 * SECTION 9 -- origin story.
 * Oversized headline, offset founder image with a sticker-style badge overlay,
 * short body, CTA.
 *
 * LAYOUT FAMILY: offset-portrait. Distinct from section 5 (text/text split),
 * section 6 (horizontal rail), section 7 (full-bleed image + card) and
 * section 8 (full-width band). Five sections, five families.
 *
 * THE OFFSET is the device here: the portrait sits lower than the headline and
 * overlaps the body column's top edge, so the two blocks interlock rather than
 * sitting in tidy rows. That is what makes this read as a different family
 * from section 7's clean split.
 *
 * The badge is a real structural element, not decoration: it carries the
 * founding year, which is information the section is actually about.
 *
 * PHOTOGRAPH: labelled empty slot. No stock substitute.
 */
export default function OriginStory() {
  return (
    <section
      aria-labelledby="lp-origin-heading"
      className="bg-canvas py-section"
    >
      <div className="mx-auto max-w-lp px-gutter">
        <div className="grid gap-lp7 lg:grid-cols-12 lg:gap-lp6">
          {/* Headline spans wide, then the columns interlock below it. */}
          <div className="lg:col-span-12">
            <SectionIntro
              headline="We built the thing we kept looking for."
              headlineId="lp-origin-heading"
            />
          </div>

          {/* Portrait, offset down and overlapping the body column. */}
          <div className="lg:col-span-5 lg:-mt-lp5">
            <div className="relative">
              <MediaSlot
                src="/media/founder.jpg"
                alt="A founder of EduVerse."
                slotPath="public/media/founder.jpg"
                label="Awaiting photography"
                note="Real founder portrait, 3:4. Deliberately left empty rather than filled with stock."
                aspect="aspect-[3/4]"
                className="rounded-lpXl"
              />

              {/* Sticker badge. Carries the founding year, so it is content,
                  not ornament. Rotated slightly so it reads as applied to the
                  photograph rather than laid out with it. */}
              <div className="absolute -bottom-lp4 -right-lp3 rotate-[-6deg] rounded-lpFull bg-lime px-lp5 py-lp3 shadow-[0_10px_30px_-12px_rgba(52,52,46,0.5)] sm:-right-lp5">
                <p className="font-body text-eyebrow font-semibold uppercase tracking-lpEyebrow text-accentText">
                  Since 2025
                </p>
              </div>
            </div>
          </div>

          {/* Body column. */}
          <Reveal
            className="flex flex-col gap-lp5 lg:col-span-6 lg:col-start-7 lg:pt-lp7"
            start="top 82%"
          >
            <p className="font-body text-lpLead text-primaryText">
              We were both teaching ourselves things at the same time, and both
              stuck in the same place.
            </p>
            <p className="max-w-measure font-body text-lpBody text-secondaryText">
              Not stuck on the material. Stuck on the order. Every evening
              started with twenty minutes of deciding what to open, and half
              the time the answer was something we were not ready for yet.
            </p>
            <p className="max-w-measure font-body text-lpBody text-secondaryText">
              So we built the sequencer first and the rest afterwards. It is
              still the part we care most about.
            </p>

            <a
              href="/ai-roadmap"
              className="mt-lp2 inline-flex w-fit items-center justify-center rounded-lpFull border border-strong px-lp6 py-lp4 font-body text-lpSm font-semibold text-primaryText transition-colors duration-200 ease-lpOut hover:bg-surfaceSunken active:scale-[0.98]"
            >
              Try the sequencer
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
