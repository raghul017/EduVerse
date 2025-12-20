import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useAuthStore } from "../store/authStore.js";
import { BookOpen, Bookmark, Flame, TrendingUp, Loader2, BarChart3 } from "lucide-react";

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 p-6 text-center">
            <p className="text-red-400 text-[14px]">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 text-[13px] text-[#FF6B35] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subjectsCount = stats?.subjects_explored_count || stats?.subjects_count || 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-[12px] text-[#FF6B35] mb-4 tracking-[0.15em] font-mono">
            <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
            [ USER DASHBOARD ]
          </div>
          <h1 className="text-[48px] font-bold text-white mb-2 leading-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Learner"} 👋
          </h1>
          <p className="text-[#666] text-[16px]">
            Track your learning progress and keep your streak alive
          </p>
        </div>

        {stats && (
          <>
            {/* Stats Grid */}
            <div className="mb-10">
              <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ OVERVIEW</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                      <BookOpen size={18} className="text-[#FF6B35]" />
                    </div>
                    <span className="text-[12px] text-[#555] uppercase tracking-wide">Videos Watched</span>
                  </div>
                  <div className="text-[36px] font-bold text-white">{stats.posts_watched || 0}</div>
                </div>
                
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                      <Bookmark size={18} className="text-[#FF6B35]" />
                    </div>
                    <span className="text-[12px] text-[#555] uppercase tracking-wide">Bookmarked</span>
                  </div>
                  <div className="text-[36px] font-bold text-white">{stats.bookmarks_count || 0}</div>
                </div>
                
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                      <TrendingUp size={18} className="text-[#FF6B35]" />
                    </div>
                    <span className="text-[12px] text-[#555] uppercase tracking-wide">Topics Explored</span>
                  </div>
                  <div className="text-[36px] font-bold text-white">{subjectsCount}</div>
                </div>
                
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                      <Flame size={18} className="text-[#FF6B35]" />
                    </div>
                    <span className="text-[12px] text-[#555] uppercase tracking-wide">Current Streak</span>
                  </div>
                  <div className="text-[36px] font-bold text-[#FF6B35]">{stats.streak_count || 0} <span className="text-[16px] text-[#666]">days</span></div>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="mb-10">
              <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ LEARNING_ACTIVITY</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5">
                  <div className="text-[11px] text-[#FF6B35] uppercase tracking-wide mb-2 font-mono">AI Summaries Viewed</div>
                  <div className="text-[28px] font-bold text-white">{stats.posts_watched || 0}</div>
                </div>
                
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5">
                  <div className="text-[11px] text-[#FF6B35] uppercase tracking-wide mb-2 font-mono">Topics Created</div>
                  <div className="text-[28px] font-bold text-white">{stats.subjects_created_count || 0}</div>
                </div>
                
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5">
                  <div className="text-[11px] text-[#FF6B35] uppercase tracking-wide mb-2 font-mono">Total Learning Time</div>
                  <div className="text-[28px] font-bold text-white">{stats.total_time || 0} <span className="text-[14px] text-[#666]">hrs</span></div>
                </div>
              </div>
            </div>

            {/* Progress Section - Styled like 'Tasks Per $1' Reference */}
            {stats.subjects_progress && stats.subjects_progress.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h2 className="text-[12px] font-mono text-[#FF6B35] tracking-widest uppercase">SYS: LEARNING_MONITOR</h2>
                  <div className="text-[10px] text-[#444] font-mono text-right">
                    METRIC: EFFICIENCY<br/>STATUS: OPTIMIZED
                  </div>
                </div>
                
                <h3 className="text-[28px] font-bold text-white mb-8 px-1">Concept Mastery</h3>

                <div className="bg-[#0a0a0a] border border-[#222] p-8 relative overflow-hidden">
                  {/* Background grid for the card */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                  
                  <div className="relative z-10 space-y-8">
                    {stats.subjects_progress.map((subject, idx) => (
                      <div key={idx}>
                        <div className="flex items-end justify-between mb-2">
                          <span className="text-[11px] text-[#888] font-mono uppercase tracking-wider">{subject.name.toUpperCase().replace(/\s+/g, '_')}</span>
                          <span className="text-[12px] text-[#666] font-mono">{String(subject.progress || 0).padStart(2, '0')}</span>
                        </div>
                        {/* Striped Progress Bar */}
                        <div className="h-6 w-full bg-[#111] border border-[#222]">
                          <div 
                            className="h-full relative overflow-hidden transition-all duration-700 ease-out"
                            style={{ width: `${subject.progress || 0}%` }}
                          >
                            <div className="absolute inset-0 bg-[#FF6B35]" style={{
                              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, #000000 2px, #000000 4px)`
                            }}></div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Overall Metric Block */}
                    <div className="pt-8 mt-4 border-t border-[#222] grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                        <div className="text-[24px] font-bold text-[#FF6B35] mb-1">
                           {stats.subjects_progress.reduce((acc, curr) => acc + (curr.progress || 0), 0) / stats.subjects_progress.length | 0}%
                        </div>
                        <div className="text-[10px] text-[#555] font-mono tracking-widest uppercase">AVG_MASTERY</div>
                      </div>
                      <div>
                        <div className="text-[24px] font-bold text-[#FF6B35] mb-1">
                          {stats.streak_count || 1}x
                        </div>
                        <div className="text-[10px] text-[#555] font-mono tracking-widest uppercase">CONSISTENCY</div>
                      </div>
                      <div>
                        <div className="text-[24px] font-bold text-[#FF6B35] mb-1">
                          100%
                        </div>
                        <div className="text-[10px] text-[#555] font-mono tracking-widest uppercase">ACCURACY</div>
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-[#888] mt-2 mb-1">
                          SOTA
                        </div>
                        <div className="text-[10px] text-[#555] font-mono tracking-widest uppercase">PERFORMANCE</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
