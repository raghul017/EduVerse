import { BentoCard } from '../ui/BentoCard';
import { Search, Target, FileCode, Share2, Tag } from 'lucide-react';

/**
 * WorkflowBento - Bento grid showcasing EduVerse's intelligent workflow
 * Adapted from NovaPulse "Workflow Engine" section
 */
export const WorkflowBento = () => {
  return (
    <section className="flex flex-col max-w-7xl mt-24 mr-auto mb-24 ml-auto px-4 lg:px-6 gap-12">
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit { animation: orbit 20s linear infinite; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.2); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
        }
        .animate-pulse-glow { animation: pulse-glow 3s infinite; }
      `}</style>

      {/* Section Header */}
      <div className="flex flex-col items-center text-center animate-enter">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium  hover:bg-white/10 transition-colors cursor-default shadow-[0_0_15px_rgba(59,130,246,0.15)] text-[#FF6B35]">
          <Target className="w-4 h-4" />
          Workflow Engine
        </div>
        <h2 className="text-3xl text-slate-50 md:text-4xl font-bold tracking-tighter">
          Complete control from{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r animate-pulse to-[#FF6B35] from-white font-bold tracking-tighter">
            concept to mastery
          </span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-slate-400">
          Manage your learning path, sync progress across devices, and track your journey with our intelligent learning suite.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 gap-y-6">
        
        {/* Card 1: Live Progress Sync */}
        <BentoCard colSpan={1} delay={0.1} gradient="blue">
          <div className="z-10 flex-1 flex flex-col mb-6 relative justify-between">
            <div className="relative mb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-200 transition-colors group-hover:text-white">
                  Live Progress Sync
                </h3>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Track your learning in real-time across all your devices and sessions.
              </p>
            </div>
            
            {/* UI Mockup */}
            <div className="relative z-10 space-y-3  border border-white/5 bg-slate-950/50 p-4 transition-all group-hover:border-white/10 group-hover:bg-slate-950/80">
              {/* Search */}
              <div className="flex items-center gap-2  border border-white/10 bg-slate-900 px-3 py-2 transition-colors group-hover:border-[#FF6B35]/30">
                <Search className="w-3.5 h-3.5 text-slate-500 transition-colors group-hover:text-[#FF6B35]" />
                <span className="text-[10px] text-slate-500 group-hover:text-slate-400">Track progress...</span>
              </div>
              
              {/* User Activity */}
              <div className="mt-2">
                <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">Active Now</div>
                <div className="flex items-center justify-between  bg-white/5 p-2 group-hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br p-[1px] to-[#ff7a4a] from-[#FF6B35]">
                      <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-semibold text-[#FF6B35]">
                        JD
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-medium text-slate-200">John Doe</div>
                      <div className="text-[9px] text-slate-400">React Fundamentals</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] text-emerald-400">Learning</span>
                    <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-3/4 rounded-full bg-emerald-500 animate-[pulse_1s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Universal Learning Hub */}
        <BentoCard colSpan={2} delay={0.2} gradient="blue">
          <div className="relative z-10 flex h-full flex-col items-center justify-center py-8">
            {/* Connection Graph */}
            <div className="relative flex h-32 w-full max-w-md items-center justify-center">
              {/* Center Node */}
              <div className="relative z-20 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-900 shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.4)]">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white animate-pulse from-[#FF6B35] to-[#ff7a4a]">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              
              {/* Satellites */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-center opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:-translate-x-2">
                <div className="flex h-10 w-10 items-center justify-center  bg-white/5 border border-white/10 text-slate-300">
                  <FileCode className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 items-center opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-2">
                <div className="flex h-10 w-10 items-center justify-center  bg-white/5 border border-white/10 text-slate-300">
                  <Share2 className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute bottom-[-20px] flex flex-col gap-1 items-center opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-y-2">
                <div className="flex h-10 w-10 items-center justify-center  bg-white/5 border border-white/10 text-slate-300">
                  <Tag className="w-5 h-5" />
                </div>
              </div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 h-full w-full text-white/10 pointer-events-none">
                <path d="M60 64 L 160 64" stroke="currentColor" strokeWidth="1" className="transition-colors duration-500 group-hover:stroke-[#ff7a4a]/30" />
                <path d="M380 64 L 280 64" stroke="currentColor" strokeWidth="1" className="transition-colors duration-500 group-hover:stroke-[#ff7a4a]/30" />
                <path d="M220 100 L 220 120" stroke="currentColor" strokeWidth="1" className="transition-colors duration-500 group-hover:stroke-[#ff7a4a]/30" />
              </svg>
            </div>
          </div>
          
          <div className="relative z-10 mt-auto">
            <h3 className="text-lg font-semibold text-slate-200 transition-colors group-hover:text-[#FF6B35]">
              Universal Learning Hub
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Access your courses, notes, and progress from any device, seamlessly synced.
            </p>
          </div>
        </BentoCard>

        {/* Card 3: Smart Path Builder */}
        <BentoCard colSpan={2} delay={0.3} gradient="blue">
          <div className="relative z-10 mb-6 max-w-md">
            <h3 className="text-lg font-semibold text-slate-200 transition-colors group-hover:text-white">
              Intelligent Path Builder
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Automatically generate learning structures based on your goals and skill level.
            </p>
          </div>
          
          <div className="relative z-10 mt-auto">
            {/* Flowchart UI */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1  border border-white/5 bg-slate-950/50 p-4 shadow-lg group-hover:border-white/10 group-hover:bg-slate-950/80 transition-colors">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-slate-300">
                  <Target className="w-3.5 h-3.5 text-[#FF6B35]" />
                  Path Builder
                </div>
                
                {/* Tree/Flow */}
                <div className="relative flex flex-col gap-2">
                  {/* Root */}
                  <div className="flex justify-center">
                    <div className=" border border-white/10 bg-slate-900 px-3 py-1.5 text-[10px] text-slate-300 shadow-sm cursor-pointer hover:bg-slate-800 hover:border-white/20 transition-colors">
                      Goal: <span className="text-[#FF6B35]">Learn Web Development</span>
                    </div>
                  </div>
                  {/* Lines */}
                  <div className="flex justify-center h-4 w-full relative">
                    <div className="absolute top-0 bottom-0 w-px bg-white/10 left-1/2 -translate-x-1/2 transition-colors duration-500 group-hover:bg-[#FF6B35]/50" />
                    <div className="absolute bottom-0 h-px w-32 bg-white/10 left-1/2 -translate-x-16 transition-colors duration-500 delay-100 group-hover:bg-[#FF6B35]/50" />
                    <div className="absolute bottom-0 h-1 w-px bg-white/10 left-1/2 -translate-x-16 transition-colors duration-500 delay-150 group-hover:bg-[#FF6B35]/50" />
                    <div className="absolute bottom-0 h-1 w-px bg-white/10 left-1/2 translate-x-16 transition-colors duration-500 delay-150 group-hover:bg-[#FF6B35]/50" />
                  </div>
                  {/* Branches */}
                  <div className="flex justify-center gap-4">
                    <div className="w-24  border border-white/10 bg-slate-800/50 px-2 py-1.5  hover:scale-105 cursor-pointer transition-all duration-300 hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/10">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_4px_currentColor] bg-[#FF6B35]" />
                        <span className="text-[10px] text-slate-300">HTML/CSS</span>
                      </div>
                      <div className="mt-1 text-[9px] text-slate-500">6 Modules</div>
                    </div>
                    <div className="w-24  border border-white/10 bg-slate-800/50 px-2 py-1.5  hover:scale-105 cursor-pointer transition-all duration-300 hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/10">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_4px_currentColor] bg-[#FF6B35]" />
                        <span className="text-[10px] text-slate-300">JavaScript</span>
                      </div>
                      <div className="mt-1 text-[9px] text-slate-500">12 Modules</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Card 4: Learning Analytics */}
        <BentoCard colSpan={1} delay={0.4} gradient="blue">
          <div className="relative z-10 mb-6">
            {/* Profile Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-3 group/profile cursor-pointer">
                <div className="h-10 w-10 overflow-hidden  bg-slate-800 group-hover/profile:rotate-3 transition-transform">
                  <div className="h-full w-full flex items-center justify-center text-sm font-bold text-[#FF6B35] bg-gradient-to-br from-[#FF6B35]/20 to-[#ff7a4a]/20">
                    MY
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover/profile:text-white">My Progress</h4>
                  <p className="text-[10px] text-slate-400">Learning Analytics</p>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/20 hover:scale-110 transition-all cursor-pointer">
                  <Share2 className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Body */}
          <div className="relative z-10 space-y-3">
            <div className=" border border-white/5 bg-slate-950/30 p-3 group-hover:bg-slate-950/50 transition-colors">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Tag className="w-3 h-3" />
                auto-tracked skills
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border hover:scale-105 transition-all cursor-default bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20 hover:bg-[#FF6B35]/20">
                  #React
                </span>
                <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border hover:scale-105 transition-all cursor-default bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20 hover:bg-[#FF6B35]/20">
                  #JavaScript
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between  border border-dashed border-white/10 bg-white/5 p-2.5 transition-all hover:bg-white/10 hover:border-white/30 cursor-pointer group/export active:scale-95">
              <span className="text-[11px] text-slate-300 group-hover/export:text-white">Export Progress Data</span>
              <Share2 className="w-3 h-3 text-slate-400 group-hover/export:text-white group-hover/export:translate-x-1 transition-transform" />
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-base font-semibold text-slate-200 transition-colors group-hover:text-white">
              Export Ready
            </h3>
            <p className="text-xs text-slate-400">
              Track progress and export detailed analytics anytime.
            </p>
          </div>
        </BentoCard>

      </div>
    </section>
  );
};

export default WorkflowBento;
