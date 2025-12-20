import React from "react";
import { FileText, Settings, Play } from "lucide-react";

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 relative">
      <div className=" border-gradient p-6 sm:p-8 relative " style={{ background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)' }}>
        {/* Header */}
        <div className="flex gap-6 pr-1 pl-1 items-center animate-on-scroll animate">
          <h2 className="text-[44px] sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] text-white tracking-tighter">How it works.</h2>
          <span aria-hidden="true" role="separator" className="w-px bg-white/20 h-10 hidden sm:block"></span>
          <p className="sm:text-base text-sm text-slate-300 mt-1 tracking-tight hidden sm:block">Three simple steps to mastery</p>
        </div>
        <div className="h-px bg-white/20 mt-4"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 mt-6 sm:mt-8 relative items-stretch">
          
          {/* STEP 1 */}
          <div className="lg:col-span-4 border-gradient rounded-[28px] p-6 sm:p-8 relative h-full flex flex-col animate-on-scroll animate delay-100" style={{ background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)' }}>
            <span className="absolute -top-4 left-6 inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-neutral-950 text-xs sm:text-sm text-white tracking-tight">STEP 1</span>
            <div className="relative h-48 sm:h-56  bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
              <div className="bg-neutral-900/90 border border-white/10  p-4 shadow-2xl">
                <FileText size={48} className="text-[#FF6B35] mx-auto mb-2" />
                <div className="h-2 w-24 bg-white/20 rounded mx-auto"></div>
              </div>
            </div>
            <h3 className="mt-6 text-3xl sm:text-4xl text-white tracking-tighter">Describe your goal</h3>
            <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-[52ch] tracking-tight">Simply tell our AI what you want to learn. "I want to be a React Developer" or "Learn Astrophysics".</p>
          </div>

          {/* STEP 2 */}
          <div className="lg:col-span-4 border-gradient rounded-[28px] p-6 sm:p-8 relative h-full flex flex-col animate-on-scroll animate delay-200" style={{ background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)' }}>
            <span className="absolute -top-4 left-6 inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-neutral-950 text-xs sm:text-sm text-white tracking-tight">STEP 2</span>
            <div className="relative h-48 sm:h-56  bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
               <div className="bg-neutral-900/90 border border-white/10  p-4 shadow-2xl">
                <Settings size={48} className="text-purple-400 mx-auto mb-2 animate-spin-slow" />
                <div className="h-2 w-24 bg-white/20 rounded mx-auto"></div>
              </div>
            </div>
            <h3 className="mt-6 text-3xl sm:text-4xl text-white tracking-tighter">AI plans your path</h3>
            <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-[52ch] tracking-tight">Our engine analyzes thousands of resources to create a personalized, step-by-step curriculum.</p>
          </div>

          {/* STEP 3 */}
          <div className="lg:col-span-4 border-gradient rounded-[28px] p-6 sm:p-8 relative h-full flex flex-col animate-on-scroll animate delay-300" style={{ background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)' }}>
            <span className="absolute -top-4 left-6 inline-flex items-center px-4 py-1.5 rounded-full border border-white/20 bg-neutral-950 text-xs sm:text-sm text-white tracking-tight">STEP 3</span>
            <div className="relative h-48 sm:h-56  bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
               <div className="bg-neutral-900/90 border border-white/10  p-4 shadow-2xl">
                <Play size={48} className="text-green-400 mx-auto mb-2" />
                <div className="h-2 w-24 bg-white/20 rounded mx-auto"></div>
              </div>
            </div>
            <h3 className="mt-6 text-3xl sm:text-4xl text-white tracking-tighter">Track & Master</h3>
            <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-[52ch] tracking-tight">Follow the roadmap, track your progress, and master the skill with curated resources.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
