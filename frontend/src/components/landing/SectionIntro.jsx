import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Dev-only guard for the Anton comma rule.
 *
 * Anton's comma descends to -0.1147em, pushing the worst-case ink span to
 * 0.9741em, which is above the 0.95 leading ceiling. When a non-final line
 * ends in a comma or parenthesis AND a glyph sits directly beneath it, the
 * mark physically strikes that glyph. Raising leading does not fix it, it
 * only slides the comma sideways into the neighbouring gap.
 *
 * The fix is a copy rule, so this enforces the copy rule at authoring time
 * rather than leaving it in a comment where it would erode across 13
 * sections. Measures the real rendered line boxes, so it catches breaks
 * caused by viewport width, not just by the source string.
 *
 * Stripped from production builds: the whole body is behind import.meta.env.DEV
 * which Vite statically replaces with `false`, so the block is dead-code
 * eliminated and the ResizeObserver never ships.
 */
const TRAILING_DESCENDER = /[,(){}[\]]\s*$/;

function useCommaRuleWarning(ref, headline) {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let cancelled = false;
    const check = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (cancelled) return;
        const node = el.firstChild;
        if (!node || node.nodeType !== Node.TEXT_NODE) return;

        // Walk the text node character by character, recording where the
        // browser actually broke the line, so we can read each visual line.
        const range = document.createRange();
        const text = node.textContent;
        const lines = [];
        let start = 0;
        let lastTop = null;

        for (let i = 1; i <= text.length; i++) {
          range.setStart(node, i - 1);
          range.setEnd(node, i);
          const top = range.getBoundingClientRect().top;
          if (lastTop === null) lastTop = top;
          if (Math.abs(top - lastTop) > 1) {
            lines.push(text.slice(start, i - 1));
            start = i - 1;
            lastTop = top;
          }
        }
        lines.push(text.slice(start));

        // Only non-final lines matter. A trailing mark on the last line is
        // handled by the padding-bottom descender reserve.
        const offenders = lines
          .slice(0, -1)
          .map((line, i) => ({ line: line.trim(), i }))
          .filter(({ line }) => TRAILING_DESCENDER.test(line));

        if (offenders.length) {
          console.warn(
            `[SectionIntro] Anton comma rule: line ${offenders
              .map((o) => o.i + 1)
              .join(", ")} of this headline ends in a descending mark, which ` +
              `will strike the glyph below it.\n` +
              `  headline: "${headline}"\n` +
              offenders.map((o) => `  line ${o.i + 1}: "${o.line}"`).join("\n") +
              `\n  Fix: rewrite so the break lands without a trailing comma or ` +
              `parenthesis. Raising line-height does NOT fix this. ` +
              `See src/styles/landing-system.css.`
          );
        }
      });
    };

    // Fonts must be loaded before measuring: with the fallback face the line
    // boxes differ, so the break positions would be wrong and the check would
    // both miss real offenders and invent false ones.
    // NOTE: attach the observer synchronously rather than inside the
    // fonts.ready callback. Under StrictMode the effect runs twice, and if the
    // observer is created in an async callback the first mount's cleanup can
    // disconnect it before the second mount attaches, leaving no observer.
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (document.fonts.status === "loaded") check();
    else document.fonts.ready.then(check);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [ref, headline]);
}

/**
 * SectionIntro -- the structural backbone of the landing page.
 *
 * Every content section uses this same three-part rhythm:
 *   1. eyebrow      small, uppercase, wide letter-spacing, muted
 *   2. headline     oversized, heavy, tight tracking, 2-3 lines max
 *   3. supporting   body copy column and/or a single CTA
 *
 * ONE component. It is deliberately NOT configurable per section beyond
 * tone (cream vs dark) and alignment, because the repetition IS the device.
 * Resist adding variants. If a section needs a different header treatment,
 * that is a signal the section is wrong, not that this component is.
 *
 * TYPOGRAPHY CONTRACT (enforced, see src/styles/landing-system.css):
 *   - The headline renders in Anton via `font-display` + `text-display`.
 *     `text-display` clamps at a 40px floor, so Anton can never fall below
 *     the size where its counters close up. HARD RULE 2.
 *   - The eyebrow and supporting copy render in Inter. Never Anton.
 *   - `as` controls the heading level for document outline only; it does not
 *     change the visual size. Exactly one <h1> should exist on the page.
 */
function SectionIntro({
  eyebrow,
  headline,
  children,
  tone = "cream",
  align = "left",
  as: Heading = "h2",
  headlineId,
  className = "",
}) {
  const headlineRef = useRef(null);
  // Dev-only. Warns if a non-final line ends in a descending mark. No-op in prod.
  useCommaRuleWarning(
    headlineRef,
    typeof headline === "string" ? headline : ""
  );

  const isDark = tone === "dark";

  // Only two tones exist. Cream sections and dark sections (8, 10, footer).
  const eyebrowTone = isDark ? "text-onDark2" : "text-mutedText";
  const headlineTone = isDark ? "text-onDark" : "text-primaryText";
  const supportTone = isDark ? "text-onDark2" : "text-secondaryText";

  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      {/* VERTICAL RHYTHM. The two gaps are deliberately unequal so the three
          parts read as one unit rather than three evenly spaced items:
          eyebrow binds TIGHT to the headline (it is a label on it), the
          support copy breaks AWAY (it is a hierarchy step down). ~1:3.3.
          Both are tokens because all 13 sections inherit them. */}
      {/* NOTE: no `m-0` here. Tailwind emits `.m-0` and `.mb-introEyebrow` at
          equal specificity, so the shorthand can win on source order and
          silently zero the gap. Margin is set on one axis only. */}
      {eyebrow && (
        <p
          className={`font-body text-eyebrow font-semibold uppercase ${eyebrowTone} mt-0 mb-introEyebrow`}
        >
          {eyebrow}
        </p>
      )}

      {/* Anton via .lp-display, which carries the 40px floor, -0.025em
          tracking, 0.9 leading, and the descender reserve that keeps a
          trailing comma from colliding with what follows.
          text-balance evens the rag; never hard-break with <br> or nowrap. */}
      <Heading
        ref={headlineRef}
        id={headlineId}
        className={`lp-display ${headlineTone}`}
      >
        {headline}
      </Heading>

      {/* Supporting slot: body column, CTA, or both. The caller controls the
          column width via max-w-measure. */}
      {children && (
        <div
          className={`font-body text-lpLead ${supportTone} mt-introSupport ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

SectionIntro.propTypes = {
  /** Small uppercase label above the headline. Optional: the skill caps
   *  eyebrows at roughly one per three sections, so most sections omit it. */
  eyebrow: PropTypes.string,
  /** The oversized headline. 2-3 lines max. Never pass pre-broken markup. */
  headline: PropTypes.node.isRequired,
  /** Supporting body copy and/or a single CTA. */
  children: PropTypes.node,
  /** Which ground this sits on. Drives text colour only. */
  tone: PropTypes.oneOf(["cream", "dark"]),
  align: PropTypes.oneOf(["left", "center"]),
  /** Heading level for the document outline. Visual size never changes. */
  as: PropTypes.oneOf(["h1", "h2", "h3"]),
  headlineId: PropTypes.string,
  className: PropTypes.string,
};

export default SectionIntro;
