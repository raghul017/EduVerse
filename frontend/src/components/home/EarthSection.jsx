import React from "react";
import { Star, ArrowUpRight, Zap, Brain, Box } from "lucide-react";

export function EarthSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Earth Image */}
        <div className="relative aspect-square w-full rounded-[40px] overflow-hidden border border-white/10 bg-black animate-on-scroll animate">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col justify-center animate-on-scroll animate delay-100">
          
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400">
              <Star size={12} fill="currentColor" />
            </div>
            <span className="text-sm font-medium text-slate-400">About EduVerse</span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter text-white leading-[1.1] mb-6">
            Global knowledge <br />
            <span className="text-slate-400">network.</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
            EduVerse combines cutting-edge AI technology with a global community of learners. Our platform empowers you to access world-class education from anywhere on Earth.
          </p>

          {/* Button */}
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors w-fit mb-12 group">
            Explore Features
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Zap size={24} className="text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Lightning Fast</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate roadmaps in seconds, not hours.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Brain size={24} className="text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">AI-Powered</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Advanced intelligence handles complexity for you.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Box size={24} className="text-white mb-3" />
              <h3 className="text-white font-semibold mb-1">Fully Scalable</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grow your skills from beginner to expert.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
