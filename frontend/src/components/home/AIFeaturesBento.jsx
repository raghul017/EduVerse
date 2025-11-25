import { BentoCard } from '../ui/BentoCard';
import { Bot, Laptop, Monitor, Smartphone, Scissors, FileText, Wand2, PlayCircle } from 'lucide-react';

/**
 * AIFeaturesBento - AI-powered features showcase
 * Adapted from NovaPulse "Neural Processing" section
 */
export const AIFeaturesBento = () => {
  return (
    <section className="flex flex-col max-w-7xl mr-auto ml-auto px-4 lg:px-6 pb-24 gap-12">
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Section Header */}
      <div className="flex flex-col items-center text-center animate-enter">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-transform hover:scale-105 cursor-default text-blue-400">
          <Bot className="w-4 h-4" />
          Neural Processing
        </div>
        <h2 className="text-3xl text-slate-50 md:text-4xl font-bold tracking-tighter">
          Your learning,{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r animate-pulse to-blue-500 from-blue-400 font-bold tracking-tighter">
            supercharged
          </span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-slate-400">
          Advanced AI tools integrated directly into your learning workflow, available on every platform.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 h-auto gap-y-5">
        
        {/* Card 1: AI Study Assistant */}
        <div className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-slate-900/80 bg-gradient-to-tl via-slate-900/40 rounded-3xl p-6 relative backdrop-blur-md animate-enter hover:shadow-blue-500/10 hover:border-blue-500/30 from-blue-500/10 to-blue-500/10"
          style={{
            '--border-gradient': 'linear-gradient(315deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.2))',
            '--border-radius-before': '24px',
            animationDelay: '0.1s'
          }}>
          <div className="z-10 flex-1 flex flex-col mb-6 relative justify-center">
            <div className="relative rounded-xl border border-white/10 bg-slate-950/50 p-4 shadow-2xl transition-colors group-hover:bg-slate-950/80">
              {/* Chat Bubble */}
              <div className="mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-slate-500" />
                <div className="rounded-lg bg-white/5 px-3 py-1.5 text-[11px] text-slate-200 border border-white/5 transition-colors group-hover:border-blue-500/20">
                  Explain this concept to me
                </div>
              </div>
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[Bot, FileText, Wand2, Scissors].map((Icon, i) => (
                  <button key={i} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 p-2 transition-all hover:bg-white/10 hover:scale-105 active:scale-95">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="h-1.5 w-8 rounded-full bg-white/20" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="z-10 mt-auto relative">
            <h3 className="text-lg font-semibold text-slate-200 transition-colors group-hover:text-blue-300">
              AI Study Assistant
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Natural language control for complex learning tasks and queries.
            </p>
          </div>
        </div>

        {/* Card 2: Cross-Platform Sync */}
        <div className="group flex flex-col overflow-hidden md:col-span-2 bg-gradient-to-tl via-slate-900/40 rounded-3xl px-6 py-6 relative transition-all duration-300 hover:shadow-2xl hover:bg-slate-900/60 animate-enter from-blue-500/20 to-blue-500/20 hover:shadow-blue-500/10 hover:border-blue-500/30"
          style={{
            '--border-gradient': 'linear-gradient(315deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.2))',
            '--border-radius-before': '24px',
            animationDelay: '0.2s'
          }}>
          <div className="relative z-10 flex h-full flex-col items-center justify-center py-8">
            {/* Connection Graph */}
            <div className="relative flex h-32 w-full max-w-md items-center justify-center">
              {/* Center Node */}
              <div className="relative z-20 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-900 shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.4)]">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white animate-pulse from-blue-400 to-blue-500">
                  <Bot className="w-6 h-6" />
                </div>
              </div>
              
              {/* Satellites */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-center opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:-translate-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300">
                  <Laptop className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-center opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300">
                  <Monitor className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute bottom-[-20px] flex flex-col gap-1 items-center opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300">
                  <Smartphone className="w-5 h-5" />
                </div>
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 h-full w-full text-white/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <circle cx="50%" cy="50%" r="96" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_30s_linear_infinite]" />
                <circle cx="50%" cy="50%" r="60" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-30" />
              </svg>
            </div>
          </div>
          
          <div className="relative z-10 mt-auto">
            <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
              Universal Sync Platform
            </h3>
            <p className="max-w-xs text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
              Access your learning materials seamlessly across desktop, web, and mobile.
            </p>
          </div>
        </div>

        {/* Card 3: Smart Annotations */}
        <div className="group flex flex-col overflow-hidden hover:bg-slate-900/60 hover:shadow-xl transition-all bg-gradient-to-tl via-slate-900/40 rounded-3xl p-6 relative backdrop-blur-md animate-enter from-blue-500/20 to-blue-500/20"
          style={{
            '--border-gradient': 'linear-gradient(315deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.2))',
            '--border-radius-before': '24px',
            animationDelay: '0.3s'
          }}>
          <div className="relative z-10 flex-1 flex flex-col justify-center mb-6">
            <div className="relative w-full rounded-xl border border-white/5 bg-slate-950 p-4 group-hover:border-white/20 transition-colors">
              {/* Text/Waveform Representation */}
              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded bg-slate-800" />
                <div className="relative">
                  <div className="h-2 w-full rounded bg-slate-800 group-hover:bg-slate-700 transition-colors" />
                  {/* Highlight */}
                  <div className="absolute left-1/4 top-[-2px] bottom-[-2px] w-1/3 rounded border transition-all bg-blue-500/20 border-blue-500/30 group-hover:border-blue-400/50 group-hover:bg-blue-500/30" />
                  {/* Tooltip */}
                  <div className="absolute left-[40%] bottom-full mb-2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-800 px-2 py-1 shadow-xl transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:-translate-y-1">
                    <div className="p-1 text-slate-400 cursor-pointer transition-colors hover:text-blue-400">
                      <Scissors className="w-3.5 h-3.5" />
                    </div>
                    <div className="h-3 w-px bg-white/10" />
                    <div className="p-1 text-slate-400 cursor-pointer transition-colors hover:text-blue-400">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="h-3 w-px bg-white/10" />
                    <div className="p-1 text-slate-400 cursor-pointer transition-colors hover:text-blue-400">
                      <Wand2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
                <div className="h-2 w-5/6 rounded bg-slate-800" />
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <h3 className="text-lg font-semibold text-slate-200 transition-colors group-hover:text-blue-300">
              Contextual Tools
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Smart menus appear instantly based on your selection.
            </p>
          </div>
        </div>

        {/* Card 4: Notes Generator */}
        <div className="group flex flex-col overflow-hidden hover:bg-slate-900/60 hover:shadow-xl transition-all bg-gradient-to-tl via-slate-900/40 rounded-3xl p-6 relative backdrop-blur-md animate-enter from-blue-500/20 to-blue-500/20"
          style={{
            '--border-gradient': 'linear-gradient(315deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.2))',
            '--border-radius-before': '24px',
            animationDelay: '0.4s'
          }}>
          <div className="-translate-x-1/2 bg-gradient-to-b from-[#ffffff]/5 via-[#ffffff]/5 to-transparent w-full h-32 pointer-events-none absolute top-0 left-1/2" />
          
          <div className="relative z-10 flex-1 flex flex-col justify-center mb-6">
            <div className="relative w-full rounded-xl border border-white/5 bg-slate-950 p-4 group-hover:translate-y-1 transition-transform duration-500">
              <div className="mb-2 rounded bg-slate-900 p-2 text-[10px] text-slate-500 border border-white/5">
                We've analyzed the content and generated comprehensive notes.
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full flex items-center justify-center animate-pulse bg-blue-500/20">
                  <FileText className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-[10px] text-slate-300">Generating notes...</span>
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <h3 className="text-lg font-semibold text-slate-200 transition-colors group-hover:text-blue-300">
              Notes Generator
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Overcome writer's block with AI-generated summaries and outlines.
            </p>
          </div>
        </div>

        {/* Card 5: Resource Scanner */}
        <div className="group flex flex-col overflow-hidden hover:bg-slate-900/60 hover:shadow-xl transition-all bg-gradient-to-tl via-slate-900/40 rounded-3xl p-6 relative backdrop-blur-md animate-enter from-blue-500/20 to-blue-500/20"
          style={{
            '--border-gradient': 'linear-gradient(315deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.2))',
            '--border-radius-before': '24px',
            animationDelay: '0.4s'
          }}>
          <div className="relative z-10 flex-1 flex flex-col justify-center mb-6">
            <div className="relative w-full overflow-hidden rounded-xl border border-white/5 bg-slate-950 p-4 transition-colors group-hover:border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded bg-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-3.5 h-3.5" />
                </div>
                <div className="h-2 w-12 rounded bg-slate-800 group-hover:bg-slate-700 transition-colors" />
              </div>
              <div className="space-y-2 opacity-50">
                <div className="h-2 w-full rounded bg-slate-800" />
                <div className="h-2 w-3/4 rounded bg-slate-800" />
              </div>
              {/* Scanner Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent to-transparent shadow-[0_0_8px_#3b82f6] animate-scan opacity-0 group-hover:opacity-100 via-blue-400" />
            </div>
          </div>
          <div className="mt-auto">
            <h3 className="text-lg font-semibold text-slate-200 transition-colors group-hover:text-blue-300">
              Resource Scanner
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Analyze videos and articles from any platform to extract key concepts.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AIFeaturesBento;
