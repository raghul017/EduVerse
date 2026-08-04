import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * SECTION 3 -- hero.
 * Full-bleed looping muted video, oversized caps headline, one line of
 * sub-copy, two CTAs side by side.
 *
 * HERO STACK DISCIPLINE (skill 4.7): exactly 3 text elements, under the cap
 * of 4. Headline, sub-copy, CTAs. No eyebrow, no trust micro-strip, no
 * tagline below the buttons, no version label. The old hero had 6 including
 * a warning banner, five vendor-name pills and a "Groq Ultra-Fast" strip.
 *
 * The headline is NOT a SectionIntro: it is the page h1 and the only place
 * where the display type sits over media, so it needs its own scrim handling.
 * Every OTHER section uses SectionIntro.
 *
 * PARALLAX is on the video only, never on the text (brief).
 */
export default function Hero() {
  const scope = useRef(null);
  const mediaRef = useRef(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Entrance. Opacity + y, matching the page-wide Reveal timing.
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

      // Media parallax. Disabled entirely under reduced motion, per the brief:
      // scrub and parallax go, opacity fades stay.
      if (reduced) return;
      gsap.to(mediaRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="relative isolate flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-dark"
    >
      {/* MEDIA. 110% tall so the parallax has somewhere to travel without
          exposing an edge. */}
      <div ref={mediaRef} className="absolute inset-0 -z-10 h-[112%]">
        {/* TODO: replace with real EduVerse footage. Muted, looping, no audio
            track. Poster comes from the same grayscale seed so the first
            paint matches the video's tone rather than flashing a colour. */}
        <video
          className="h-full w-full object-cover opacity-[0.55]"
          poster="https://picsum.photos/seed/eduverse-hero-study/1920/1080?grayscale"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          {/* TODO: supply /video/hero.webm and /video/hero.mp4.
              Until then the poster frame is what renders, which is why the
              poster is a real image and not a placeholder colour. */}
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        {/* Scrim. Without it the headline sits on unpredictable video luminance
            and the contrast guarantee is lost. Weighted to the bottom where
            the copy sits. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-dark via-dark/75 to-dark/35"
        />
      </div>

      <div className="mx-auto w-full max-w-lp px-gutter pb-lp9 pt-lp10">
        {/* h1. Not SectionIntro, see the note above. Uses the same .lp-display
            token so the 40px floor and 0.9 leading are identical. */}
        <h1 className="lp-hero-enter lp-display max-w-[16ch] text-onDark">
          Stop collecting courses. Start finishing one.
        </h1>

        {/* Sub-copy: 18 words, inside the 20-word hero cap. */}
        <p className="lp-hero-enter mt-introSupport max-w-measure font-body text-lpLead text-onDark2">
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
            className="inline-flex items-center justify-center rounded-lpFull border border-onDark2/40 px-lp6 py-lp4 font-body text-lpSm font-semibold text-onDark transition-colors duration-200 ease-lpOut hover:border-onDark hover:bg-onDark/10 active:scale-[0.98]"
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
