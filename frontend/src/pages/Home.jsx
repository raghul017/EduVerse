import "../styles/landing-system.css";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AnnouncementBar from "../components/landing/AnnouncementBar.jsx";
import LandingNav from "../components/landing/LandingNav.jsx";
import Hero from "../components/landing/Hero.jsx";
import ProductProof from "../components/landing/ProductProof.jsx";
import Mission from "../components/landing/Mission.jsx";
import OfferingsRail from "../components/landing/OfferingsRail.jsx";
import ForCompanies from "../components/landing/ForCompanies.jsx";
import MarqueeBand from "../components/landing/MarqueeBand.jsx";
import OriginStory from "../components/landing/OriginStory.jsx";
import Testimonials from "../components/landing/Testimonials.jsx";
import CommunityGrid from "../components/landing/CommunityGrid.jsx";
import SiteFooter from "../components/landing/SiteFooter.jsx";

/**
 * EduVerse landing page. This is the "/" route.
 *
 * It renders OUTSIDE MainLayout (see App.jsx) because it carries its own
 * navigation and its own footer. Rendering it inside
 * MainLayout would stack the app Navbar above LandingNav, and MainLayout's
 * container padding would break the full-bleed sections.
 *
 * Sections, in order:
 *   1  announcement bar      AnnouncementBar
 *   2  nav                   LandingNav
 *   3  hero                  Hero            typographic, no media
 *   4  product proof         ProductProof    real generator screenshot
 *   5  mission               Mission
 *   6  offerings rail        OfferingsRail
 *   7  for companies         ForCompanies
 *   8  marquee band          MarqueeBand
 *   9  origin story          OriginStory
 *  10  dark testimonials     Testimonials    EB Garamond lives here only
 *  11  community grid        CommunityGrid
 *  12  footer                SiteFooter      two-line EDU / VERSE wordmark
 *
 * The newsletter that previously sat at 12 is REMOVED, not disabled. It posted
 * nowhere, and a form on a live page that silently does nothing is worse than
 * no form. Whether EduVerse sends email is a product decision, not a landing
 * page one. Section 11's "Join a community" and the footer already carry the
 * follow-up action. Twelve sections, renumbered.
 *
 * The placeholder logo strip that previously sat at 4 is DELETED, not
 * deferred. Six invented monograms were doing no work, and the slot is better
 * spent putting real product on screen one scroll from the headline. Revisit
 * only if real partner logos exist and there is a real relationship to claim.
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
        <ProductProof />
        <Mission />
        <OfferingsRail />
        <ForCompanies />
        <MarqueeBand />
        <OriginStory />
        <Testimonials />
        <CommunityGrid />
      </main>
      <SiteFooter />
    </div>
  );
}
