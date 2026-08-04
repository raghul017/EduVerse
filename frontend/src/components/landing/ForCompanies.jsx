import { Link } from "react-router-dom";
import Reveal from "./Reveal.jsx";
import MediaSlot from "./MediaSlot.jsx";

/**
 * SECTION 7 -- for companies.
 * Full-bleed image left, --surface card right containing eyebrow, headline,
 * body, a labelled bulleted list, and a CTA.
 *
 * LAYOUT FAMILY: image-left / card-right. Distinct from section 5's
 * text-left / text-right asymmetric split, so no layout family repeats
 * (skill 4.7). Section 6 is a horizontal rail and section 8 is a full-width
 * band, so four consecutive sections use four different families.
 *
 * The list is 4 items. Under the >5 threshold where a plain <ul> becomes the
 * lazy choice and a different component is required (skill 4.9), and it does
 * NOT use border-t + border-b on every row.
 *
 * MEDIA SLOT: labelled empty state at the correct aspect ratio. No Picsum.
 */

// TODO: real photography of a team working. 3:4 portrait, min 1200x1600.
// If no real photograph is available this slot stays empty rather than being
// filled with stock. An empty labelled slot is honest; stock is not.
const IMAGE = "/media/for-companies.jpg";

const POINTS = [
  "Paths built around the stack you actually run",
  "Progress you can see per person and per team",
  "One place for the material people keep re-explaining",
  "Onboarding that does not start from a blank page",
];

export default function ForCompanies() {
  return (
    <section
      aria-labelledby="lp-companies-heading"
      className="bg-canvas py-section"
    >
      {/* Full-bleed on mobile, split from lg. The image column bleeds to the
          viewport edge on the left, which is what makes this read as a
          different family from section 5 rather than a second text split. */}
      <div className="grid items-stretch gap-lp6 lg:grid-cols-2 lg:gap-0">
        <MediaSlot
          src={IMAGE}
          alt="A team working together at a shared desk."
          slotPath="public/media/for-companies.jpg"
          label="Awaiting photography"
          note="Real photograph of a team, 3:4 portrait. Deliberately left empty rather than filled with stock."
          aspect="min-h-[320px] lg:min-h-[640px]"
          className="lg:rounded-r-lpXl"
          imgClassName="h-full w-full object-cover"
        />

        {/* Card column. --surface, so it lifts off the canvas ground. */}
        <div className="flex items-center px-gutter lg:px-lp8">
          <Reveal className="w-full max-w-[560px] rounded-lpXl border border-subtle bg-surfaceRaised p-lp6 lg:p-lp7">
            <p className="font-body text-eyebrow font-semibold uppercase tracking-lpEyebrow text-mutedText">
              For teams
            </p>

            {/* Inter, not Anton: this is a card heading inside a panel, and
                the display face is headline-only above 40px. HARD RULE 2. */}
            <h2
              id="lp-companies-heading"
              className="mt-lp3 font-body text-lpH2 font-semibold leading-tight text-primaryText"
            >
              High-performing teams are not born. They are trained.
            </h2>

            <p className="mt-lp4 max-w-measure font-body text-lpBody text-secondaryText">
              The same sequencing that works for one person works for a team.
              Give people a shared path instead of a shared folder of links.
            </p>

            <ul className="mt-lp5 flex flex-col gap-lp3">
              {POINTS.map((p) => (
                <li key={p} className="flex gap-lp3 font-body text-lpSm text-secondaryText">
                  {/* Marker, not a decorative status dot: it is a list bullet
                      and carries list semantics, which skill 9.F permits. */}
                  <span
                    aria-hidden="true"
                    className="mt-[0.55em] h-[5px] w-[5px] shrink-0 rounded-lpFull bg-strong"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/communities"
              className="mt-lp6 inline-flex items-center justify-center rounded-lpFull bg-lime px-lp6 py-lp4 font-body text-lpSm font-semibold text-accentText transition-transform duration-200 ease-lpOut hover:brightness-[0.97] active:scale-[0.98]"
            >
              Talk to us
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
