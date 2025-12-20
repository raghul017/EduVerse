import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, PlayCircle } from "lucide-react";
import { AnimatedButton } from "../ui/AnimatedButton";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Spline 3D Animation Background - Absolute inside hero */}
      <div className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
        <iframe
          src="https://my.spline.design/retrofuturismbganimation-Lb3VtL1bNaYUnirKNzn0FvaW"
          frameBorder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          title="3D Background Animation"
          style={{ pointerEvents: 'none' }}
        />
        {/* Overlay to ensure text readability and match template aesthetic */}
        <div className="absolute inset-0 bg-black/40 -[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Pill Badge */}
          <div className="mb-8 animate-on-scroll animate">
            <div className="inline-flex items-center gap-2 rounded-full border-gradient bg-white/5 px-3 py-1.5 text-xs text-neutral-300 ">
              <span className="inline-flex items-center justify-center rounded-full bg-[#FF6B35]/20 text-[#FF6B35] px-2 py-0.5 font-medium">
                New
              </span>
              <span className="font-medium">Studio-grade learning in one prompt</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-8 leading-[0.95] animate-on-scroll animate delay-100">
            Powering the next wave of
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B35] via-purple-400 to-[#FF6B35] animate-pulse">
              AI‑driven learning
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-on-scroll animate delay-200">
            EduVerse turns your goals into personalized roadmaps. Describe your targets—our AI scores, plans, and guides you through mastery with precision.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll animate delay-300">
            <AnimatedButton
              to="/ai-roadmap"
              variant="pulse"
              className="px-8 py-4 text-base font-medium rounded-full"
            >
              Start Learning Free
            </AnimatedButton>

            <div className="inline-block group relative">
              <Link
                to="/videos"
                className="inline-flex gap-2 border-gradient hover:text-white transition-all hover:-translate-y-0.5 text-sm font-medium text-white/80 bg-white/5 rounded-full px-6 py-4  items-center"
              >
                <PlayCircle className="w-5 h-5 opacity-70" />
                Watch demo
              </Link>
              <span className="pointer-events-none absolute -bottom-3 left-1/2 z-0 h-6 w-44 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" style={{ background: 'radial-gradient(60% 100% at 50% 50%, rgba(59,130,246,.55), rgba(59,130,246,.28) 35%, transparent 70%)', filter: 'blur(10px) saturate(120%)' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
