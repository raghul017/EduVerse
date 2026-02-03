import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useAuthStore } from "../store/authStore.js";
import { BookOpen, Bookmark, Flame, TrendingUp, Loader2, Clock, Target, Zap, Activity, MoreHorizontal, ArrowUpRight, Layers, Map, Cpu } from "lucide-react";
import SpotlightCard from "../components/ui/SpotlightCard";
import ScrollReveal from "../components/ui/ScrollReveal";
import Magnetic from "../components/ui/Magnetic";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        setStats(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 p-6 text-center rounded-[20px] backdrop-blur-md">
            <p className="text-red-400 text-sm font-mono">&gt;_ ERROR: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 ev-button ev-button--secondary text-xs"
            >
              System Reboot
            </button>
          </div>
        </div>
      </div>
    );
  }

  const roadmapsCount = stats?.roadmaps_count || 0;
  const completedNodes = stats?.completed_nodes || 0;
  const aiUsagePercent = stats?.ai_usage_percent || 0;

  return (
    <div className="min-h-screen text-textPrimary font-sans pb-24 overflow-x-hidden" style={{ backgroundColor: 'var(--page-bg-light)' }}>
      
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-noise opacity-[0.03] absolute inset-0"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen animate-float-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen animate-float-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 pt-8 sm:pt-16">
        
        {/* Header - Mission Control */}
        <ScrollReveal>
          <header className="mb-10 sm:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border mb-6 backdrop-blur-md">
                <span className="w-1.5 h-1.5 bg-accent-action rounded-full animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-textSecondary">System Online</span>
              </div>
              <h1 className="text-4xl sm:text-fluid-hero text-white mb-4 leading-none tracking-tighter">
                MISSION<br/><span className="text-textSecondary opacity-30">CONTROL</span>
              </h1>
            </div>
            
            <div className="flex flex-col items-start lg:items-end gap-4 sm:gap-6">
              <p className="text-textSecondary text-base sm:text-xl max-w-md lg:text-right text-balance">
                Ready for deployment, <span className="text-white font-semibold">{user?.name?.split(" ")[0] || "Commander"}</span>. 
                You have <span className="text-accent animate-pulse">{roadmapsCount}</span> active roadmaps.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                 <Magnetic>
                   <button className="ev-button ev-button--secondary text-[10px] sm:text-xs uppercase tracking-wider py-2 sm:py-3 px-4 sm:px-6">
                      <Activity size={14} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Activity</span> Log
                   </button>
                 </Magnetic>
                 <Magnetic>
                   <button className="ev-button ev-button--primary text-[10px] sm:text-xs uppercase tracking-wider py-2 sm:py-3 px-4 sm:px-6 font-bold">
                      <Zap size={14} className="mr-1 sm:mr-2" /> <span className="hidden sm:inline">Quick</span> Action
                   </button>
                 </Magnetic>
              </div>
            </div>
          </header>
        </ScrollReveal>

        {/* Bento Grid Layout */}
        <ScrollReveal delay={0.2} stagger={0.1}>
          <div className="bento-grid gap-6">
             
             {/* Main Stat - Streak (Simulated Heatmap) - SOLID ORANGE VARIANT */}
             <SpotlightCard variant="solid" className="col-span-1 md:col-span-2 min-h-[200px] sm:min-h-[300px] p-4 sm:p-8 flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay"></div>
                <div className="flex justify-between items-start z-10 relative">
                   <div>
                      <div className="flex items-center gap-2 text-black/60 text-xs font-mono uppercase tracking-wider mb-2 font-bold">
                         <Flame size={14} className="text-black" /> Current Streak
                      </div>
                      <div className="text-4xl sm:text-7xl font-bold text-black tracking-tighter -ml-1">
                         {stats.streak_count || 0}<span className="text-xl sm:text-3xl text-black/40 ml-2 font-medium">days</span>
                      </div>
                   </div>
                   <div className="p-3 bg-black/10 rounded-full backdrop-blur-sm">
                      <TrendingUp size={24} className="text-black" />
                   </div>
                </div>
                
                {/* Visual Heatmap Decoration */}
                <div className="mt-8 flex gap-1.5 items-end h-24 opacity-40 mix-blend-multiply">
                   {[40, 60, 30, 80, 50, 90, 20, 40, 70, 40, 60, 80, 50, 70, 90, 60, 40, 80, 30, 50, 70, 90, 60, 80, 45, 65, 35, 85, 55].map((h, i) => (
                      <div key={i} className="flex-1 bg-black/60 rounded-t-sm" style={{height: `${h}%`}}></div>
                   ))}
                </div>
             </SpotlightCard>
  
             {/* Quick Stat - Roadmaps Created */}
             <SpotlightCard className="p-4 sm:p-8 relative flex flex-col items-center justify-center overflow-hidden min-h-[200px] sm:min-h-[300px]" spotlightColor="rgba(59, 130, 246, 0.15)">
                <div className="absolute inset-0 flex items-center justify-center opacity-10 scale-150 pointer-events-none">
                   <div className="w-64 h-64 border-[30px] border-blue-500 rounded-full"></div>
                </div>
                <div className="text-center z-10">
                   <div className="text-4xl sm:text-6xl font-bold text-white mb-2 tracking-tighter">
                      {roadmapsCount}
                   </div>
                   <div className="text-xs font-mono uppercase tracking-widest text-textMuted border-t border-border pt-4 mt-2">Roadmaps Created</div>
                </div>
                <div className="absolute top-6 right-6 p-2 bg-blue-500/10 rounded-full">
                   <Map size={20} className="text-blue-500" />
                </div>
             </SpotlightCard>
  
             {/* Metric Cards - Row 2 */}
             <SpotlightCard className="p-4 sm:p-8 flex flex-col justify-between hover:bg-surface-hover transition-colors min-h-[180px] sm:min-h-[220px]" spotlightColor="rgba(255, 255, 255, 0.08)">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 rounded-[16px] bg-surface flex items-center justify-center text-textSecondary border border-border">
                      <Target size={24} />
                   </div>
                   {completedNodes > 0 && 
                      <span className="flex items-center text-[10px] text-accent-action bg-accent-action/10 border border-accent-action/20 px-2 py-1 rounded-full font-mono">
                         <ArrowUpRight size={10} className="mr-1" /> Active
                      </span>
                   }
                </div>
                <div>
                   <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{completedNodes}</div>
                   <div className="text-xs sm:text-sm text-textMuted mt-1">Nodes Completed</div>
                </div>
             </SpotlightCard>
  
             <SpotlightCard className="p-4 sm:p-8 flex flex-col justify-between hover:bg-surface-hover transition-colors min-h-[180px] sm:min-h-[220px]" spotlightColor="rgba(255, 255, 255, 0.08)">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 rounded-[16px] bg-surface flex items-center justify-center text-textSecondary border border-border">
                      <Bookmark size={24} />
                   </div>
                </div>
                <div>
                   <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{stats.bookmarks_count || 0}</div>
                   <div className="text-xs sm:text-sm text-textMuted mt-1">Saved Resources</div>
                </div>
             </SpotlightCard>
  
             <SpotlightCard className="p-4 sm:p-8 flex flex-col justify-between hover:bg-surface-hover transition-colors min-h-[180px] sm:min-h-[220px]" spotlightColor="rgba(161, 255, 98, 0.08)">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 rounded-[16px] bg-surface flex items-center justify-center text-textSecondary border border-border">
                      <Cpu size={24} />
                   </div>
                   <span className={`flex items-center text-[10px] ${aiUsagePercent > 80 ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-accent bg-accent/10 border-accent/20'} border px-2 py-1 rounded-full font-mono`}>
                      {aiUsagePercent}% used
                   </span>
                </div>
                <div>
                   <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{stats.ai_requests_today || 0}</div>
                   <div className="text-xs sm:text-sm text-textMuted mt-1">AI Requests Today</div>
                </div>
             </SpotlightCard>
  
             {/* Active Projects / Detailed Progress - Full Width */}
             <div className="col-span-1 md:col-span-3 mt-4 sm:mt-8">
                <div className="flex items-center justify-between mb-4 sm:mb-8">
                   <h3 className="text-xs sm:text-sm font-mono text-textMuted flex items-center gap-2 uppercase tracking-widest">
                      <Layers size={14} /> Active Directives
                   </h3>
                   <div className="h-[1px] flex-1 bg-border/50 ml-4 sm:ml-6"></div>
                </div>
                
                <div className="grid gap-4">
                   {stats.subjects_progress && stats.subjects_progress.length > 0 ? (
                      stats.subjects_progress.map((subject, idx) => (
                         <SpotlightCard key={idx} className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 group hover:border-accent/40" spotlightColor="rgba(161, 255, 98, 0.08)">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-surface flex items-center justify-center text-accent font-bold text-xl sm:text-2xl border border-border group-hover:border-accent/50 transition-colors shadow-lg shadow-black/20">
                               {subject.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                               <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 mb-2 sm:mb-3">
                                  <h4 className="text-base sm:text-xl font-bold text-white group-hover:text-accent transition-colors">{subject.name}</h4>
                                  <span className="font-mono text-xs sm:text-sm text-textSecondary bg-surface px-2 py-1 rounded border border-border w-fit">{subject.progress}%</span>
                               </div>
                               <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-white/5">
                                  <div 
                                     className="h-full bg-accent relative overflow-hidden transition-all duration-1000 ease-out"
                                     style={{ width: `${subject.progress}%` }}
                                  >
                                     <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                                  </div>
                               </div>
                            </div>
                            <Magnetic strength={20}>
                               <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border bg-surface hover:bg-white hover:text-black flex items-center justify-center text-textMuted transition-all duration-300 group/btn">
                                  <MoreHorizontal size={18} />
                               </button>
                            </Magnetic>
                         </SpotlightCard>
                      ))
                   ) : (
                      <div className="p-12 border border-dashed border-border rounded-2xl text-center bg-surface/30">
                         <p className="text-textMuted mb-6 text-lg">No active directives initiated.</p>
                         <Magnetic>
                            <button className="ev-button ev-button--primary text-sm px-8 py-3">Initialize New Roadmap</button>
                         </Magnetic>
                      </div>
                   )}
                </div>
             </div>
  
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

export default Dashboard;
