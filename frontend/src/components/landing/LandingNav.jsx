import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore.js";

/**
 * SECTION 2 -- navigation.
 * Wordmark left, links centre, ONE solid pill CTA right.
 *
 * Solid fill, never glass: the brief is explicit, and a translucent bar over
 * a full-bleed video hero is exactly the glassmorphism default the skill
 * warns against.
 *
 * Height: 64px, inside the 80px cap. Single line at desktop.
 * Below lg the links collapse to a disclosure rather than wrapping to two
 * lines, since a two-line nav at desktop is broken design.
 */
const LINKS = [
  { to: "/ai-roadmap", label: "Roadmaps" },
  { to: "/ai-course", label: "Courses" },
  { to: "/ai-tutor", label: "Tutor" },
  { to: "/communities", label: "Community" },
];

export default function LandingNav() {
  const { user } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Opaque on scroll. IntersectionObserver on a sentinel rather than a scroll
  // listener: scroll handlers are banned (skill 5.D) because they fire every
  // frame and cannot be batched.
  useEffect(() => {
    const sentinel = document.getElementById("lp-nav-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px" }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Close the mobile disclosure on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <div id="lp-nav-sentinel" aria-hidden="true" className="h-px w-full" />

      {/* The hero is now typographic on a cream ground, not video, so the bar
          sits on a known light surface at every scroll position and always
          uses dark text. The previous on-dark treatment and scrim existed for
          the video hero; with a cream hero they made the wordmark cream on
          cream, i.e. invisible.
          If a media hero ever returns, the unscrolled state needs on-dark
          tokens plus a scrim again, because video luminance is unknowable. */}
      <header
        className={`sticky top-0 z-30 transition-colors duration-300 ease-lpOut ${
          scrolled ? "border-b border-subtle bg-canvas" : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className="relative mx-auto flex h-16 max-w-lp items-center justify-between gap-lp5 px-gutter"
        >
          {/* Wordmark. Inter, not Anton: below the 40px display floor. */}
          <Link
            to="/"
            className="font-body text-lpH3 font-semibold tracking-tight text-primaryText"
          >
            EduVerse
          </Link>

          {/* Centre links. Hidden below lg so the bar never wraps. */}
          <ul className="hidden items-center gap-lp6 lg:flex">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `font-body text-lpSm transition-colors duration-200 ease-lpOut ${
                      isActive
                        ? "text-primaryText"
                        : "text-secondaryText hover:text-primaryText"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-lp3">
            {/* ONE solid pill CTA. bg-lime + text-accentText is the only legal
                pairing on a light surface. HARD RULE 1. */}
            <Link
              to={user ? "/ai-roadmap" : "/signup"}
              className="rounded-lpFull bg-lime px-lp5 py-lp2 font-body text-lpSm font-semibold text-accentText [transition-property:transform,filter] duration-200 ease-lpOut hover:brightness-[0.97] active:scale-[0.96]"
            >
              {user ? "Dashboard" : "Get started"}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="lp-mobile-menu"
              className="flex h-11 w-11 items-center justify-center text-primaryText lg:hidden"
            >
              {menuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Opaque regardless of scroll state: the panel can open while the bar
            is still transparent over the video, and cream-on-video would be
            unreadable. */}
        {menuOpen && (
          <div
            id="lp-mobile-menu"
            className="relative border-t border-subtle bg-canvas lg:hidden"
          >
            <ul className="mx-auto flex max-w-lp flex-col px-gutter py-lp3">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className="block py-lp3 font-body text-lpLead text-primaryText"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
