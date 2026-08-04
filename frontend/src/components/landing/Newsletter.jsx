import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * SECTION 12 -- newsletter.
 * Centred, serif heading, email input with an --accent submit button.
 *
 * CENTRED IS DEFENSIBLE HERE. The skill's anti-centre bias applies to heroes
 * and content sections; a single-field signup is one of the cases where the
 * message IS the layout and centring is correct.
 *
 * FORM CONTRAST (skill 4.5): label is visible and above the input, not a
 * placeholder-as-label. Input text is --text-primary on --surface, the border
 * is --border-input (the darkest border token) so the field reads as a field,
 * and the focus ring is a real visible outline. Error text sits below the
 * input in --error.
 *
 * The submit button is bg-lime + text-accentText, the only legal pairing on a
 * light surface.
 *
 * NOTE: this posts nowhere yet. Rather than fake a success state, it validates
 * locally and then says plainly that signup is not connected. Pretending to
 * subscribe someone is worse than admitting the wiring is pending.
 * TODO: connect to a real list and replace the notice with a real confirmation.
 */
export default function Newsletter() {
  const inputId = useId();
  const noteId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | invalid | pending

  const onSubmit = (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setState(ok ? "pending" : "invalid");
  };

  return (
    <section
      aria-labelledby="lp-news-heading"
      className="border-t border-subtle bg-canvas py-section"
    >
      <div className="mx-auto flex max-w-[640px] flex-col items-center px-gutter text-center">
        {/* Serif heading. Section 10 owns EB Garamond as a section voice; this
            is the one other place the brief asks for it, and it is a single
            line rather than a display block. */}
        <h2
          id="lp-news-heading"
          className="lp-serif max-w-[18ch] text-primaryText"
        >
          One email, when something is worth reading.
        </h2>

        <p className="mt-introSupport max-w-measure font-body text-lpBody text-secondaryText">
          No course dumps. No streak reminders.
        </p>

        <form onSubmit={onSubmit} className="mt-lp6 w-full" noValidate>
          {/* Label above the input, never a placeholder-as-label. */}
          <label
            htmlFor={inputId}
            className="block text-left font-body text-eyebrow font-semibold uppercase tracking-lpEyebrow text-mutedText"
          >
            Email address
          </label>

          <div className="mt-lp2 flex flex-col gap-lp3 sm:flex-row">
            <input
              id={inputId}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state !== "idle") setState("idle");
              }}
              placeholder="you@example.com"
              aria-invalid={state === "invalid"}
              aria-describedby={state === "idle" ? undefined : noteId}
              className="min-h-[48px] w-full rounded-lpFull border border-inputBorder bg-surfaceRaised px-lp5 font-body text-lpBody text-primaryText placeholder:text-mutedText focus:outline-none focus:ring-2 focus:ring-primaryText focus:ring-offset-2 focus:ring-offset-canvas"
            />
            <button
              type="submit"
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-lp2 rounded-lpFull bg-lime px-lp6 font-body text-lpSm font-semibold text-accentText [transition-property:transform,filter] duration-200 ease-lpOut hover:brightness-[0.97] active:scale-[0.96]"
            >
              Subscribe
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Feedback below the input. */}
          {state !== "idle" && (
            <p
              id={noteId}
              role="status"
              className={`mt-lp3 text-left font-body text-lpSm ${
                state === "invalid" ? "text-danger" : "text-secondaryText"
              }`}
            >
              {state === "invalid"
                ? "Enter an email address in the form you@example.com."
                : "Signup is not connected yet, so nothing was sent. This form is not wired to a list."}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
