import SectionIntro from "../components/landing/SectionIntro.jsx";
import "../styles/landing-system.css";

/**
 * TEMPORARY REVIEW HARNESS -- not part of the landing page.
 * Renders SectionIntro in both tones at real size so the backbone can be
 * approved before sections 1-13 are built. Delete once approved.
 */

function Swatch({ name, value, note, dark }) {
  return (
    <div className="flex items-center gap-lp3">
      <span
        className="h-10 w-10 shrink-0 rounded-lpSm border border-subtle"
        style={{ backgroundColor: value }}
      />
      <div className="min-w-0">
        <p className={`font-body text-lpXs ${dark ? "text-onDark" : "text-primaryText"} m-0`}>
          {name}
        </p>
        <p className={`font-body text-lpXs ${dark ? "text-onDark2" : "text-mutedText"} m-0 tabular-nums`}>
          {value}
          {note ? ` · ${note}` : ""}
        </p>
      </div>
    </div>
  );
}

export default function SectionIntroPreview() {
  return (
    <div className="lp-root min-h-screen">
      {/* ---------------- CREAM ---------------- */}
      <section className="px-gutter py-section">
        <div className="mx-auto max-w-lp">
          <p className="font-body text-eyebrow uppercase text-mutedText mb-lp7">
            SectionIntro · cream tone · tone="cream"
          </p>

          <SectionIntro
            eyebrow="Why we exist"
            headline="Most people don't need another course. They need a plan."
            as="h1"
          >
            <p className="max-w-measure">
              EduVerse builds you a roadmap in about ninety seconds, then stays with you while
              you work through it. Every step has resources, and an AI tutor that has read them.
            </p>
            <div className="mt-lp5 flex flex-wrap items-center gap-lp3">
              {/* HARD RULE 1: lime is a background here, never text on cream.
                  Paired with text-accentText, which is the only permitted
                  foreground on it. */}
              <button
                type="button"
                className="rounded-lpFull bg-lime px-lp5 py-lp3 font-body text-lpSm font-semibold text-accentText transition-transform duration-200 ease-lpOut active:scale-[0.98]"
              >
                Build my roadmap
              </button>
              <button
                type="button"
                className="rounded-lpFull border border-strong px-lp5 py-lp3 font-body text-lpSm font-semibold text-primaryText transition-colors duration-200 ease-lpOut hover:bg-surfaceSunken active:scale-[0.98]"
              >
                See how it works
              </button>
            </div>
          </SectionIntro>
        </div>
      </section>

      {/* -------------- CREAM, NO EYEBROW -------------- */}
      <section className="px-gutter pb-section">
        <div className="mx-auto max-w-lp">
          <p className="font-body text-eyebrow uppercase text-mutedText mb-lp7">
            Same component, eyebrow omitted · most sections look like this
          </p>
          <SectionIntro headline="High-performing learners aren't born. They're coached.">
            <p className="max-w-measure">
              The eyebrow is optional on purpose. The skill caps eyebrows at roughly one per
              three sections, so the majority of the page omits it and lets the headline carry
              the section alone.
            </p>
          </SectionIntro>
        </div>
      </section>

      {/* ---------------- DARK ---------------- */}
      <section className="bg-dark px-gutter py-section">
        <div className="mx-auto max-w-lp">
          <p className="font-body text-eyebrow uppercase text-onDark2 mb-lp7">
            SectionIntro · dark tone · tone="dark" · sections 8, 10, footer
          </p>

          <SectionIntro
            tone="dark"
            eyebrow="What learners say"
            headline="Learning is a practice, not a purchase."
          >
            <p className="max-w-measure">
              Same component, same rhythm, only the text colours change. Anton in cream on
              #34342E at 10.06:1.
            </p>
            {/* On dark, lime IS permitted as text: 10.14:1. HARD RULE 1. */}
            <p className="mt-lp4 font-body text-lpSm font-semibold uppercase tracking-lpEyebrow text-lime">
              On dark, lime is legal as text
            </p>
          </SectionIntro>

          {/* EB Garamond, dark section only, for adjacency check */}
          <div className="mt-lp9 border-t border-onDark2/20 pt-lp7">
            <p className="font-body text-eyebrow uppercase text-onDark2 mb-lp5">
              EB Garamond 500 alongside, as it will appear in §10
            </p>
            <p className="lp-serif text-onDark">
              The roadmap took ninety seconds. The habit took ninety <em>days</em>.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- WORST-CASE LEADING ---------------- */}
      <section className="bg-canvasAlt px-gutter py-section">
        <div className="mx-auto max-w-lp">
          <p className="font-body text-eyebrow uppercase text-mutedText mb-lp7">
            Leading stress test · line-height 0.9 · worst cases in the copy
          </p>

          <div className="grid gap-lp9">
            <div>
              <p className="font-body text-lpXs text-mutedText mb-lp3 m-0">
                Three lines, first two ending in punctuation
              </p>
              <SectionIntro headline="Most people don't need another course. They need a plan, and someone to ask." />
            </div>

            <div>
              <p className="font-body text-lpXs text-mutedText mb-lp3 m-0">
                Comma directly above capitals · the case that fails without the descender reserve
              </p>
              <SectionIntro headline="Learning is a practice, not a purchase." />
            </div>

            <div>
              <p className="font-body text-lpXs text-mutedText mb-lp3 m-0">
                Apostrophes and a comma together
              </p>
              <SectionIntro headline="High-performing learners aren't born, they're coached." />
            </div>

            <div>
              <p className="font-body text-lpXs text-mutedText mb-lp3 m-0">
                Parentheses · deepest descender in the character set
              </p>
              <SectionIntro headline="Start today (properly), finish sooner." />
            </div>

            <div className="border-t border-subtle pt-lp6">
              <p className="font-body text-lpXs text-mutedText mb-lp3 m-0">
                THE ONE CASE 0.9 CANNOT SERVE · comma ending a non-final line with a
                glyph directly beneath it. The comma strikes the R of HERE.
              </p>
              <SectionIntro headline="Truth over comfort, always delivered here" />
              <p className="font-body text-lpXs text-danger mt-lp3 m-0 max-w-measure">
                This is the copy rule in the CSS, demonstrated. Raising leading does not
                fix it, it only slides the comma sideways. The fix is to rewrite the break.
              </p>
            </div>

            <div>
              <p className="font-body text-lpXs text-mutedText mb-lp3 m-0">
                Same sentence, rewritten so the break lands without a trailing comma
              </p>
              <SectionIntro headline="Truth over comfort. Always delivered here" />
              <p className="font-body text-lpXs text-okay mt-lp3 m-0 max-w-measure">
                Clear. Zero cost to the packed-block quality.
              </p>
            </div>

            <div className="border-t border-subtle pt-lp6">
              <p className="font-body text-lpXs text-mutedText mb-lp3 m-0">
                Descender reserve check · a headline ending in a comma immediately
                followed by a sibling. Without padding-bottom the comma is clipped.
              </p>
              <SectionIntro headline="Truth over comfort," />
              <p className="font-body text-lpBody text-secondaryText m-0 max-w-measure">
                This paragraph sits directly beneath the headline above with no margin
                of its own. The comma must not touch it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TOKEN CHECK ---------------- */}
      <section className="px-gutter py-section">
        <div className="mx-auto max-w-lp">
          <p className="font-body text-eyebrow uppercase text-mutedText mb-lp6">
            Token check
          </p>

          <div className="grid gap-lp5 sm:grid-cols-2 lg:grid-cols-3">
            <Swatch name="canvas" value="#EDE6D3" note="page ground" />
            <Swatch name="canvasAlt" value="#E9E8E0" note="alt band" />
            <Swatch name="surfaceRaised" value="#F7F3E9" note="card" />
            <Swatch name="surfaceSunken" value="#E4DCC6" note="well" />
            <Swatch name="dark" value="#34342E" note="dark sections" />
            <Swatch name="lime" value="#A1FF62" note="bg only on light" />
            <Swatch name="subtle" value="#CDC7B4" note="border" />
            <Swatch name="strong" value="#9A937D" note="border-strong" />
            <Swatch name="sage" value="#99A4A6" note="tint only" />
            <Swatch name="blueMid" value="#7D9EB9" note="tint only" />
            <Swatch name="okay" value="#3F6B4A" note="success" />
            <Swatch name="danger" value="#9C3B2E" note="error" />
          </div>

          <div className="mt-lp8 grid gap-lp5">
            <p className="font-body text-lpBody text-primaryText m-0">
              text-primaryText · #34342E · 10.06:1
            </p>
            <p className="font-body text-lpBody text-secondaryText m-0">
              text-secondaryText · #54554F · 6.04:1 · default body colour
            </p>
            <p className="font-body text-lpBody text-mutedText m-0">
              text-mutedText · #63645C · 4.81:1 · AA floor for body
            </p>
            <p className="font-body text-lpH3 text-disabledText m-0">
              text-disabledText · #7A7B72 · LARGE TEXT ONLY, never body copy
            </p>
          </div>

          <div className="mt-lp8 rounded-lpLg border border-subtle bg-surfaceRaised p-lp6">
            <p className="font-body text-eyebrow uppercase tracking-lpEyebrow text-mutedText m-0 mb-lp4">
              Hard rule 2 · the 40px display floor
            </p>
            <p className="font-body text-lpSm text-secondaryText max-w-measure m-0">
              There is exactly one Anton token. <code>text-display</code> clamps at{" "}
              <code>clamp(40px, 8.4vw, 140px)</code>, so the floor is structural, not a
              convention someone has to remember. Everything on this page below 40px, including
              this sentence, every card title, every rail label and every caption, is Inter.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
