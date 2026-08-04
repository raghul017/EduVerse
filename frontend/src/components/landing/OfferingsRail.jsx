import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot.jsx";

/**
 * SECTION 6 -- horizontal card rail of offerings. Five cards, mixed media.
 *
 * TWO MECHANISMS, ONE MARKUP:
 *   mobile   native horizontal scroll with CSS scroll-snap. No JS. This is
 *            the behaviour touch users already expect, and it degrades
 *            perfectly with no script.
 *   desktop  ScrollTrigger pins the section and converts vertical scroll into
 *            horizontal travel, per the canonical containerAnimation pattern.
 *
 * The horizontal tween MUST use ease: "none" or scroll position and card
 * position stop lining up. This is the single most common mistake with this
 * pattern and the GSAP docs call it out explicitly.
 *
 * REDUCED MOTION: the pin and scrub are never created. The rail falls back to
 * the same native horizontal scroll the mobile layout uses, so the content is
 * fully reachable, just without the scroll-hijack.
 *
 * MEDIA SLOTS: three of the five cards want a real screenshot. Those are
 * empty labelled slots at fixed aspect ratios, NOT Picsum and NOT rebuilt UI.
 * The two type-only cards are complete as they are; they are not placeholders.
 */

const CARDS = [
  {
    id: "roadmaps",
    kind: "media",
    // TODO: capture at 800x1000 (4:5), same rules as the section 4 shot.
    src: "/media/rail-roadmap.png",
    slot: "public/media/rail-roadmap.png",
    title: "Roadmaps",
    body: "A sequenced path for any role or skill, with every step tied to real material.",
    to: "/ai-roadmap",
    cta: "Build one",
  },
  {
    id: "tutor",
    kind: "media",
    // TODO: capture at 800x1000 (4:5). AI tutor mid-conversation.
    src: "/media/rail-tutor.png",
    slot: "public/media/rail-tutor.png",
    title: "AI tutor",
    body: "Ask about the step you are on. It has read the resources attached to it.",
    to: "/ai-tutor",
    cta: "Ask something",
  },
  {
    id: "transcription",
    kind: "type",
    // Type-only by design. Not a placeholder.
    stat: "Any video",
    title: "Transcribed and searchable",
    body: "Drop in a lecture and get a transcript, a summary, and flashcards from it.",
    to: "/videos",
    cta: "Try it",
  },
  {
    id: "courses",
    kind: "media",
    // TODO: capture at 800x1000 (4:5). Generated course outline.
    src: "/media/rail-course.png",
    slot: "public/media/rail-course.png",
    title: "Courses",
    body: "Structured modules generated around a topic, not a catalogue you browse.",
    to: "/ai-course",
    cta: "Generate one",
  },
  {
    id: "community",
    kind: "type",
    stat: "Together",
    title: "People on the same path",
    body: "Subject communities where the questions are about what you are learning now.",
    to: "/communities",
    cta: "Join one",
  },
];

function Card({ card }) {
  return (
    <article className="flex h-full w-[78vw] shrink-0 flex-col justify-between rounded-lpXl border border-subtle bg-surfaceRaised p-lp5 sm:w-[420px]">
      <div>
        {card.kind === "media" ? (
          <MediaSlot
            src={card.src}
            slotPath={card.slot}
            alt={`${card.title} in EduVerse`}
            aspect="aspect-[4/5]"
            className="rounded-lpLg"
          />
        ) : (
          // Type-only card. Bento background diversity (skill 4.7): these two
          // use a sunken tint and a large numeral rather than an image, so the
          // rail is not five identical media cards.
          <div className="flex aspect-[4/5] items-end rounded-lpLg bg-surfaceSunken p-lp5">
            <p className="font-body text-lpH2 font-semibold leading-tight text-primaryText">
              {card.stat}
            </p>
          </div>
        )}

        <h3 className="mt-lp5 font-body text-lpH3 font-semibold text-primaryText">
          {card.title}
        </h3>
        <p className="mt-lp2 font-body text-lpSm text-secondaryText">
          {card.body}
        </p>
      </div>

      <Link
        to={card.to}
        className="mt-lp5 inline-flex w-fit items-center justify-center rounded-lpFull border border-strong px-lp5 py-lp3 font-body text-lpSm font-semibold text-primaryText transition-colors duration-200 ease-lpOut hover:bg-surfaceSunken active:scale-[0.98]"
      >
        {card.cta}
      </Link>
    </article>
  );
}

export default function OfferingsRail() {
  const wrap = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const desktop = window.matchMedia("(min-width: 1024px)");
      if (reduced || !desktop.matches) return; // native scroll handles both

      const distance = () =>
        track.current.scrollWidth - wrap.current.offsetWidth;

      gsap.to(track.current, {
        x: () => -distance(),
        ease: "none", // REQUIRED. Any other ease desyncs scroll from position.
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: wrap }
  );

  return (
    <section
      ref={wrap}
      aria-labelledby="lp-rail-heading"
      className="overflow-hidden bg-canvas py-section lg:py-0"
    >
      <div className="mx-auto max-w-lp px-gutter lg:pt-section">
        {/* No eyebrow: the eyebrow budget is spent on sections 5 and 10.
            The headline alone names the section. */}
        <h2
          id="lp-rail-heading"
          className="lp-display max-w-[18ch] text-primaryText"
        >
          Everything is one path.
        </h2>
      </div>

      {/* Mobile and reduced-motion: native scroll-snap. Desktop: the track is
          translated by ScrollTrigger and overflow is hidden by the section. */}
      <div
        ref={track}
        className="mt-lp7 flex snap-x snap-mandatory gap-lp4 overflow-x-auto px-gutter pb-lp5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-lp8 lg:w-max lg:snap-none lg:overflow-visible lg:pb-section"
      >
        {CARDS.map((c) => (
          <div key={c.id} className="snap-start lg:snap-align-none">
            <Card card={c} />
          </div>
        ))}
      </div>
    </section>
  );
}
