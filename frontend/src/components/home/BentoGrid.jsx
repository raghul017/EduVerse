import React from "react";
import { Users, Code, Activity, Globe, Bot, Zap, TrendingUp, Sparkles } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartData = {
  labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  datasets: [{
    label: 'Progress',
    data: [65, 85, 95, 90, 98, 95, 92],
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    borderSkipped: false,
    barThickness: 12,
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#525252', font: { size: 10 } } },
    y: { display: false, min: 0, max: 100 }
  }
};

export function BentoGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div 
        className="grid grid-cols-1 auto-rows-[200px] md:mt-16 md:grid-cols-6 md:gap-6 lg:grid-cols-12 lg:mt-32 overflow-hidden h-auto lg:h-[800px] mt-16 gap-4" 
        style={{
          maskImage: 'linear-gradient(180deg, transparent, black 0%, black 60%, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, black 0%, black 60%, transparent)'
        }}
      >
        
        {/* Card 1: Community Hub (Large Top Left) */}
        <div 
          className="relative overflow-hidden  border-gradient md:col-span-3 lg:col-span-6 md:row-span-2 animate-on-scroll" 
          style={{
            background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
            borderRadius: '24px'
          }}
        >
          <img 
            className="h-full w-full object-cover opacity-60 transition-transform duration-700 hover:scale-105" 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            alt="Community" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent"></div>
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1 text-[11px] border-gradient text-slate-300 bg-white/5 rounded-full px-2.5 py-1 " style={{borderRadius: '9999px'}}>
              Community Hub
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full ring-2 ring-white/20 overflow-hidden -ml-2 first:ml-0">
                  <img className="h-full w-full object-cover" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                </div>
              ))}
            </div>
            <span className="text-xs text-neutral-200 font-medium">Live Session starting in 5m</span>
          </div>
        </div>

        {/* Card 2: 10k+ Roadmaps (Small Top Center) */}
        <div 
          className=" bg-white text-neutral-900 p-6 border-gradient md:col-span-3 lg:col-span-3 animate-on-scroll" 
          style={{
            background: 'linear-gradient(225deg,rgba(255,255,255,0.95) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,0.95) 100%)',
            borderRadius: '24px'
          }}
        >
          <p className="text-4xl tracking-tighter">10k+</p>
          <p className="mt-2 text-sm text-neutral-600 font-medium">Roadmaps Generated</p>
          <div className="mt-4 flex items-center gap-2 text-[#FF6B35]">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">Q4 growth 23%</span>
          </div>
        </div>

        {/* Card 3: Generate Instantly (Tall Right) */}
        <article 
          className="overflow-hidden border-gradient  relative md:col-span-3 lg:col-span-3 md:row-span-2 animate-on-scroll" 
          style={{
            background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
            borderRadius: '24px'
          }}
        >
          <div className="h-full p-6 relative flex flex-col">
            <div className="relative mx-auto h-full w-full flex items-center justify-center flex-1">
              <div className="scale-[0.85] w-full">
                <div className="-[2px] bg-white/[0.03] border-gradient ">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                    <Code size={16} className="text-white/70" />
                    <span className="text-[11px] font-medium text-white/80">roadmap.json</span>
                    <span className="ml-auto text-[10px] text-white/50">generated</span>
                  </div>
                  <pre className="text-[10px] leading-relaxed text-white/80 p-4 font-mono">
{`{
  "title": "AI Engineer Path",
  "modules": [
    "Neural Networks",
    "Transformers",
    "LLM Fine-tuning"
  ],
  "duration": "8 weeks"
}`}
                  </pre>
                </div>
              </div>
            </div>
            <div className="relative pt-2">
              <h3 className="text-lg font-semibold tracking-tight text-white/95">Generate Instantly</h3>
              <p className="mt-2 text-sm text-white/70">Create personalized curriculums in seconds with zero effort.</p>
            </div>
          </div>
        </article>

        {/* Card 4: Learning Velocity (Chart - Middle Center) */}
        <div 
          className=" border-gradient p-6 md:col-span-3 lg:col-span-3 md:row-span-2 animate-on-scroll" 
          style={{
            background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
            borderRadius: '24px'
          }}
        >
          <h3 className="text-base font-semibold tracking-tight text-white">Learning Velocity</h3>
          <p className="mt-1 text-sm text-neutral-300">Last 30 days</p>
          <div className="mt-4  bg-black/30 p-3 border-gradient h-32">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FF6B35]">
              <span className="h-2 w-2 rounded-full bg-[#FF6B35]"></span>
              <span className="text-sm font-semibold tracking-tight">97.8%</span>
            </div>
            <span className="text-xs text-neutral-300 font-medium">GOAL MET</span>
          </div>
        </div>

        {/* Card 5: Global Reach (Bottom Left) */}
        <div 
          className="relative overflow-hidden  border-gradient md:col-span-3 lg:col-span-3 md:row-span-2 animate-on-scroll" 
          style={{
            background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
            borderRadius: '24px'
          }}
        >
          <div className="p-6 relative z-10">
            <p className="text-3xl tracking-tighter text-white">50+</p>
            <p className="mt-1 text-sm text-neutral-300">Countries Reached</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['USA', 'India', 'UK'].map(c => (
                <span key={c} className="inline-flex items-center rounded-full bg-[#FF6B35]/15 text-[#FF6B35] px-2.5 py-1 text-xs font-medium border-gradient" style={{borderRadius: '9999px'}}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-40">
            <img className="h-full w-full object-cover opacity-60" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Globe" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Card 6: AI Tutors (Bottom Center) */}
        <article 
          className="relative overflow-hidden hover:bg-white/[0.08] transition-all group  border-gradient md:col-span-3 lg:col-span-3 md:row-span-2 animate-on-scroll" 
          style={{
            background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
            borderRadius: '24px'
          }}
        >
          <div className="flex p-6 items-center justify-between">
            <h4 className="text-base font-semibold tracking-tight text-white">Personalized AI Tutors</h4>
            <span className="inline-flex items-center gap-1 text-[11px] border-gradient text-slate-300 bg-white/5 rounded-full px-2.5 py-1" style={{borderRadius: '9999px'}}>
              AI-Powered
            </span>
          </div>
          <div className="flex-1 flex p-6 pt-0 items-center">
            <div className="relative w-full">
              <div className="hover:bg-black/50 transition-all bg-black/60 border-gradient  p-3 ">
                <div className="flex gap-1 mb-2 items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B35]/80"></span>
                </div>
                <div className="overflow-x-auto">
                  <pre className="text-[10px] leading-tight min-w-max text-slate-300 font-mono">
                    <span className="text-purple-400">class</span> <span className="text-yellow-200">TutorAgent</span>:<br/>
                    &nbsp;&nbsp;<span className="text-[#FF6B35]">def</span> <span className="text-yellow-200">__init__</span>(self):<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#FF6B35]">self</span>.mode = <span className="text-green-400">"adaptive"</span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Card 7: Smart Tracking (Bottom Right) */}
        <section 
          className="group relative overflow-hidden border-gradient  md:col-span-3 lg:col-span-3 md:row-span-2 animate-on-scroll" 
          style={{
            background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
            borderRadius: '24px'
          }}
        >
          <div className="relative h-full overflow-hidden flex flex-col">
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-4 border border-white/10 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-8 bg-white/5 rounded-full  flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
               </div>
            </div>
            <div className="relative border-t border-white/10">
              <div className="p-6">
                <h3 className="text-xl tracking-tight font-semibold text-slate-100">Smart Tracking</h3>
                <p className="leading-relaxed text-slate-400 mt-3 text-sm">Real-time analytics for your learning journey.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Card 8: Student Success (Filler to match 12-col grid) */}
        <div 
          className="flex flex-col  border-gradient p-6  transition md:col-span-3 lg:col-span-3 md:row-span-2 animate-on-scroll" 
          style={{
            background: 'linear-gradient(225deg,rgba(255,255,255,0.0) 0%,rgba(255,255,255,0.05) 50%,rgba(255,255,255,0.0) 100%)',
            borderRadius: '24px'
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=5" alt="" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-xs font-semibold text-white">Alex Chen</p>
                <p className="text-[10px] text-white/60">Data Scientist</p>
              </div>
            </div>
          </div>
          <p className="leading-snug text-sm font-medium mb-4 text-white">
            "EduVerse helped me master Python in record time. The AI roadmap was spot on."
          </p>
          <div className="mb-4  border-gradient p-3">
            <p className="text-xs text-white/80 mb-2 font-medium">Key Results:</p>
            <ul className="text-xs text-white/70 space-y-1">
              <li>• 3x faster learning</li>
              <li>• Landed a new job</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
