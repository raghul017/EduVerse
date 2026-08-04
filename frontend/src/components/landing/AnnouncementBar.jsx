import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";

/**
 * SECTION 1 -- announcement bar.
 * One line, dismissible, links to a feature page.
 *
 * Replaces the old hero's "under active development" warning, which sat
 * inside the hero and burned one of the four permitted hero text slots.
 *
 * Dismissal persists for the session only. A landing page visitor who
 * dismisses this should not see it again while browsing, but should see it
 * on a fresh visit, since the announcement will change.
 */
const STORAGE_KEY = "eduverse_announcement_dismissed";

export default function AnnouncementBar() {
  const [open, setOpen] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) !== "1"
  );

  if (!open) return null;

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <div className="relative bg-dark text-onDark">
      <div className="mx-auto flex max-w-lp items-center justify-center px-gutter py-lp3 pr-lp8">
        {/* ONE LINE at every width (brief). The message is truncated rather
            than wrapped: a two-line announcement bar pushes the hero down and
            stops reading as a bar. On dark, lime IS legal as text: 10.14:1. */}
        <Link
          to="/ai-roadmap"
          className="group flex min-w-0 items-center gap-lp2 font-body text-lpXs text-onDark transition-colors duration-200 ease-lpOut hover:text-lime"
        >
          <span className="shrink-0 font-semibold uppercase tracking-lpEyebrow text-lime">
            New
          </span>
          <span className="truncate text-onDark2 group-hover:text-onDark">
            Roadmaps now include curated resources at every step
          </span>
          <ArrowRight
            size={13}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-200 ease-lpOut group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {/* 44px hit area (touch-target guideline) without a 44px visual box. */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-lp2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-onDark2 transition-colors duration-200 ease-lpOut hover:text-onDark"
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
