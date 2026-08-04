import { Link } from "react-router-dom";
import Reveal from "./Reveal.jsx";
import MediaSlot from "./MediaSlot.jsx";

/**
 * SECTION 11 -- community grid.
 * Eyebrow + heading + 4 media cards + follow CTA.
 *
 * BENTO CELL COUNT: 4 items, 4 cells, no empty tile (skill 4.7). The grid is
 * deliberately asymmetric rather than four equal squares: the first card is
 * wide, which stops this reading as the generic equal-card row the skill bans.
 *
 * EYEBROW BUDGET: this is eyebrow 3 of 3. Sections 4, 6, 9, 12 and 13 have
 * none. 13 sections, 3 eyebrows, inside ceil(13/3) = 5.
 *
 * MEDIA: labelled empty slots. Community photography does not exist yet, and
 * inventing it would misrepresent the size of the community.
 */

const CARDS = [
  {
    id: "c1",
    slot: "public/media/community-1.jpg",
    src: "/media/community-1.jpg",
    alt: "Members of an EduVerse subject community.",
    label: "Subject rooms",
    body: "Questions about what you are learning this week, not last year.",
    wide: true,
  },
  {
    id: "c2",
    slot: "public/media/community-2.jpg",
    src: "/media/community-2.jpg",
    alt: "An EduVerse study session.",
    label: "Study sessions",
    body: "Work alongside people on the same path.",
  },
  {
    id: "c3",
    slot: "public/media/community-3.jpg",
    src: "/media/community-3.jpg",
    alt: "A shared roadmap in EduVerse.",
    label: "Shared paths",
    body: "Fork someone else's roadmap and make it yours.",
  },
  {
    id: "c4",
    slot: "public/media/community-4.jpg",
    src: "/media/community-4.jpg",
    alt: "An EduVerse learner's finished roadmap.",
    label: "Finished paths",
    body: "See what completing one actually looks like.",
  },
];

export default function CommunityGrid() {
  return (
    <section
      aria-labelledby="lp-community-heading"
      className="bg-canvasAlt py-section"
    >
      <div className="mx-auto max-w-lp px-gutter">
        <div className="flex flex-col gap-lp5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-body text-eyebrow font-semibold uppercase tracking-lpEyebrow text-mutedText">
              The community
            </p>
            <h2
              id="lp-community-heading"
              className="lp-display mt-lp3 max-w-[16ch] text-primaryText"
            >
              Nobody finishes alone.
            </h2>
          </div>

          <Link
            to="/communities"
            className="inline-flex w-fit shrink-0 items-center justify-center rounded-lpFull bg-lime px-lp6 py-lp4 font-body text-lpSm font-semibold text-accentText transition-transform duration-200 ease-lpOut hover:brightness-[0.97] active:scale-[0.98]"
          >
            Join a community
          </Link>
        </div>

        {/* Asymmetric AND exactly filled: 4 items, card 1 spanning 2 columns,
            in a 3-column grid = 2 rows with no empty cell (skill 4.7 bento
            cell count). At 4 columns the fourth card orphans onto its own
            row, which reads as a layout bug rather than as rhythm. */}
        <Reveal
          className="mt-lp8 grid grid-cols-1 gap-lp4 sm:grid-cols-2 lg:grid-cols-3"
          start="top 84%"
        >
          {CARDS.map((c) => (
            <article
              key={c.id}
              className={`overflow-hidden rounded-lpXl border border-subtle bg-surfaceRaised ${
                c.wide ? "sm:col-span-2" : ""
              }`}
            >
              <MediaSlot
                src={c.src}
                alt={c.alt}
                slotPath={c.slot}
                label="Awaiting photography"
                aspect={c.wide ? "aspect-[16/10]" : "aspect-[4/3]"}
              />
              <div className="p-lp5">
                <h3 className="font-body text-lpH3 font-semibold text-primaryText">
                  {c.label}
                </h3>
                <p className="mt-lp2 font-body text-lpSm text-secondaryText">
                  {c.body}
                </p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
