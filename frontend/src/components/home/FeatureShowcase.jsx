import React from "react";
import { Link } from "react-router-dom";
import { PlayCircle, ArrowRight } from "lucide-react";

export function FeatureShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 relative">
      <div className=" border-gradient p-6 sm:p-8 " style={{ background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)' }}>
        {/* Header */}
        <div className="flex gap-6 pr-1 pl-1 items-center animate-on-scroll animate">
          <span className="text-4xl text-white tracking-tighter">Features</span>
          <span aria-hidden="true" role="separator" className="w-px bg-white/10 h-10 hidden sm:block"></span>
          <span className="text-sm text-neutral-300 hidden sm:block">what we offer</span>
        </div>
        <div className="h-px bg-white/10 mt-4"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 sm:gap-10 mt-6 sm:mt-8">
          {/* Left content */}
          <div className="lg:col-span-6 animate-on-scroll animate delay-100">
            <h1 className="text-[44px] sm:text-6xl md:text-7xl leading-[1.05] text-zinc-100 tracking-tighter">
              Let's Build Your <br/> Future Together
            </h1>

            <div className="h-px bg-white/10 mt-6"></div>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl text-zinc-100 tracking-tighter">AI Roadmaps</h3>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm text-zinc-200 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors duration-200">
                  Free Forever
                </span>
              </div>
              <p className="text-zinc-400 text-sm sm:text-base mt-3">
                Generate comprehensive learning paths for any skill in seconds. From beginner to expert, we guide every step.
              </p>
            </div>

            <div className="h-px bg-white/10 mt-6"></div>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl text-zinc-100 tracking-tighter">Personalized Tutors</h3>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm text-zinc-200 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors duration-200">
                  24/7 Support
                </span>
              </div>
              <p className="text-zinc-400 text-sm sm:text-base mt-3">
                Get instant answers, code reviews, and explanations from AI tutors that understand your unique learning style.
              </p>
            </div>

            <div className="flex gap-6 mt-8 items-center flex-wrap">
              <Link to="/ai-roadmap" className="group inline-flex items-center gap-2 hover:opacity-90 transition-opacity border-gradient text-sm font-medium text-black bg-gradient-to-r from-[#FF6B35] via-[#FF6B35] to-[#FF6B35] rounded-full pt-2.5 pr-5 pb-2.5 pl-5 shadow-[0_8px_30px_rgba(59,130,246,0.25)]">
                Start Learning <ArrowRight size={16} />
              </Link>
              <Link to="/videos" className="inline-flex border-gradient hover:text-white transition-all hover:-translate-y-0.5 text-sm font-medium text-white/80 bg-white/5 rounded-full pt-3 pr-5 pb-3 pl-5  gap-x-2 gap-y-2 items-center">
                <PlayCircle size={16} />
                Watch demo
              </Link>
            </div>
          </div>

          {/* Right showcase */}
          <div className="lg:col-span-6 animate-on-scroll animate delay-200">
            <div className="relative mx-auto w-full max-w-[860px]" style={{ filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.6))' }}>
              <div className="rounded-[28px] bg-neutral-900/60 ring-1 ring-white/10 p-3">
                <div className="relative overflow-hidden rounded-[22px] bg-neutral-950 border border-white/10">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                    <span className="h-3 w-3 rounded-full bg-zinc-700"></span>
                    <span className="h-3 w-3 rounded-full bg-zinc-700/70"></span>
                    <span className="h-3 w-3 rounded-full bg-zinc-700/50"></span>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                      {/* Project Cards - Mocking learning modules */}
                      {[
                        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=200&fit=crop",
                        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=320&h=200&fit=crop",
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=320&h=400&fit=crop", // Tall one
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=320&h=200&fit=crop",
                        "https://images.unsplash.com/photo-1550439062-609e1531270e?w=320&h=200&fit=crop"
                      ].map((src, i) => (
                        <div key={i} className={`relative overflow-hidden  border border-white/10 bg-neutral-900 hover:scale-105 transition-transform duration-300 ${i === 2 ? 'md:row-span-2' : ''}`}>
                          <img src={src} alt="Project" className="w-full h-full object-cover opacity-90" />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/50"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pointer-events-none absolute -right-24 bottom-0 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
                  <div className="pointer-events-none absolute -left-24 -top-24 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
