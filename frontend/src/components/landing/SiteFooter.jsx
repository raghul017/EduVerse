import { Link } from "react-router-dom";

/**
 * SECTION 13 -- footer.
 * Links, legal, and a giant two-line EDU / VERSE wordmark bleeding off the
 * bottom edge.
 *
 * WHY TWO LINES, measured rather than chosen by eye:
 * The reference bleeds a four-character wordmark. Real glyph advances from the
 * Anton binary, at tracking -0.045em:
 *     RIPE      1.407em over 4 chars  ->  needs ~71cqw to span the container
 *     EDUVERSE  3.249em over 8 chars  ->  needs ~30.8cqw
 * At 30.8cqw the cap-height is under half the reference's, so there is not
 * enough vertical mass for the bleed to read as a device rather than an
 * accident. Splitting into EDU / VERSE gives a 3-char and a 5-char line, both
 * near RIPE's proportion, which recovers the scale.
 * The split is also semantically honest: the name is that compound, so the
 * break reads as intentional rather than as a wrap.
 *
 * WHY cqw AND NOT vw:
 * container-type: inline-size makes the wordmark measure against its own
 * container rather than the viewport. With vw the type overflowed any max-width
 * wrapper above ~1100px and was clipped by overflow:hidden instead of spanning,
 * so the arithmetic and the render disagreed. cqw keeps the proportion
 * identical at 360px and at 1440px.
 *
 * NO clamp() CEILING. A cap would size the wordmark to one viewport and let it
 * shrink out of the bleed at every other.
 *
 * VERSE is optically reduced so both lines end flush. Derived, not eyeballed:
 * at tracking -0.05em the effective advances are EDU 1.550em and VERSE
 * 2.492em, so VERSE must be set at 1.550 / 2.492 = 0.622em relative to EDU.
 * (An earlier 0.795 was wrong: it came from sizing the two lines
 * independently in a test harness, and applying it as a RELATIVE multiplier
 * made VERSE 127% of the container, so it overflowed and collided with EDU.)
 *
 * SCALE AND LEADING, both learned by rendering rather than by arithmetic:
 *   - Each line is sized independently so BOTH span the container: EDU at
 *     64.5cqw (1.550em effective over 3 chars) and VERSE at 40.1cqw (2.492em
 *     over 5). Deriving the second from a single ratio makes the shorter line
 *     narrower, which left the mark occupying only the left half of the frame.
 *   - leading 0.9, not tighter. Anton's cap-height is 0.8594em, so anything
 *     below about 0.86 puts VERSE's cap-top into EDU's baseline band. This is
 *     the same measured floor the display token uses; see landing-system.css.
 * The footer is intentionally the one place the mark is allowed to dominate:
 * it is the last thing on the page and nothing follows it.
 */

const NAV = [
  {
    title: "Product",
    links: [
      { to: "/ai-roadmap", label: "Roadmaps" },
      { to: "/ai-course", label: "Courses" },
      { to: "/ai-tutor", label: "AI tutor" },
      { to: "/videos", label: "Video transcription" },
    ],
  },
  {
    title: "Explore",
    links: [
      { to: "/communities", label: "Communities" },
      { to: "/paths", label: "Learning paths" },
      { to: "/feed", label: "Feed" },
      { to: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Log in" },
      { to: "/signup", label: "Create an account" },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-dark pt-section">
      <div className="mx-auto max-w-lp px-gutter">
        <div className="grid gap-lp7 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-body text-lpH3 font-semibold tracking-tight text-onDark">
              EduVerse
            </p>
            <p className="mt-lp3 max-w-[28ch] font-body text-lpSm text-onDark2">
              The thing that tells you what to open next.
            </p>
          </div>

          {NAV.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="font-body text-eyebrow font-semibold uppercase tracking-lpEyebrow text-onDark2">
                {group.title}
              </h2>
              <ul className="mt-lp4 flex flex-col gap-lp3">
                {group.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="font-body text-lpSm text-onDark transition-colors duration-200 ease-lpOut hover:text-lime"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Legal. One hairline rule, using --border at low opacity so it reads
            on the dark ground. */}
        <div className="mt-lp8 flex flex-col gap-lp3 border-t border-onDark2/20 pt-lp5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-lpXs text-onDark2">
            &copy; {year} EduVerse
          </p>
          <ul className="flex flex-wrap gap-lp5">
            <li>
              <Link
                to="/"
                className="font-body text-lpXs text-onDark2 transition-colors duration-200 ease-lpOut hover:text-onDark"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="font-body text-lpXs text-onDark2 transition-colors duration-200 ease-lpOut hover:text-onDark"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* THE WORDMARK. container-type makes cqw resolve against this element,
          so the proportion is identical at every width. aria-hidden because
          the brand name is already announced by the column above; a screen
          reader does not need it twice. */}
      <div
        aria-hidden="true"
        className="mt-lp7 select-none"
        style={{ containerType: "inline-size" }}
      >
        <p className="m-0 whitespace-nowrap font-display uppercase text-onDark [letter-spacing:-0.05em] [transform:translateY(12%)]">
          {/* Each line sized to span the container at its own character count:
              EDU 1.550em effective over 3 chars, VERSE 2.492em over 5. Setting
              both from one font-size would leave the shorter line narrower. */}
          <span className="block leading-[0.9] [font-size:64.5cqw]">EDU</span>
          <span className="block leading-[0.9] [font-size:40.1cqw]">VERSE</span>
        </p>
      </div>
    </footer>
  );
}
