import "../styles/landing-system.css";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnnouncementBar from "../components/landing/AnnouncementBar.jsx";
import LandingNav from "../components/landing/LandingNav.jsx";
import Hero from "../components/landing/Hero.jsx";
import LogoStrip from "../components/landing/LogoStrip.jsx";

/**
 * EduVerse landing page. This is the "/" route.
 *
 * It renders OUTSIDE MainLayout (see App.jsx) because it carries its own
 * navigation and, once section 13 lands, its own footer. Rendering it inside
 * MainLayout would stack the app Navbar above LandingNav, and MainLayout's
 * container padding would break the full-bleed sections.
 *
 * Sections, in order:
 *   1  announcement bar      AnnouncementBar
 *   2  nav                   LandingNav
 *   3  hero                  Hero
 *   4  logo strip            LogoStrip
 *   5  mission               [batch B]
 *   6  offerings rail        [batch B]
 *   7  for companies         [batch B]
 *   8  marquee band          [batch B]
 *   9  origin story          [batch C]
 *  10  dark testimonials     [batch C]
 *  11  community grid        [batch C]
 *  12  newsletter            [batch C]
 *  13  footer                [batch C]
 *
 * .lp-root scopes the landing design system so its tokens cannot leak into
 * the other 15 pages, which still use styles/design-system.css.
 */

// Registered ONCE for the whole page, per the GSAP guidance. Section
// components assume it is already registered and never call this themselves.
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  // Trigger positions are computed from layout, and layout shifts when Anton
  // and EB Garamond swap in: a display headline can gain or lose a whole line,
  // which is 100px+ of page height. Without this refresh every trigger below
  // the fold is measured against the fallback-font layout.
  useGSAP(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="lp-root">
      <AnnouncementBar />
      <LandingNav />
      <main>
        <Hero />
        <LogoStrip />
      </main>
    </div>
  );
}
