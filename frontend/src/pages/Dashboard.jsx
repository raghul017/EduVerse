import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useAuthStore } from "../state/store.js";
import StatsCard from "../components/dashboard/StatsCard.jsx";
import StreakDisplay from "../components/dashboard/StreakDisplay.jsx";
import ProgressChart from "../components/dashboard/ProgressChart.jsx";
import AIUsageStats from "../components/ai/AIUsageStats.jsx";
import { BookOpen, Bookmark, Flame, TrendingUp } from "lucide-react";

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

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-32" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl h-28" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl h-48" />
          <div className="bg-white/5 border border-white/10 rounded-3xl h-48" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 text-sm text-red-300 hover:text-white underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const subjectsCount = stats?.subjects_explored_count || stats?.subjects_count || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-white/10 rounded-3xl p-8 shadow-sm backdrop-blur-sm">
        <p className="text-sm uppercase tracking-wide text-blue-400 font-medium mb-2">
          Dashboard
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.name?.split(" ")[0] || "Learner"} 👋
        </h1>
        <p className="text-slate-400 text-base">
          Track your learning progress and keep your streak alive.
        </p>
      </section>

      {stats && (
        <>
          {/* Main Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <StatsCard
              title="Videos Watched"
              value={stats.posts_watched || 0}
              subtitle="Total lessons completed"
              icon={<BookOpen className="text-blue-400" size={20} />}
            />
            <StatsCard
              title="Bookmarked"
              value={stats.bookmarks_count || 0}
              subtitle="Saved for later"
              icon={<Bookmark className="text-purple-400" size={20} />}
            />
            <StatsCard
              title="Subjects Explored"
              value={subjectsCount}
              subtitle="Unique topics unlocked"
              icon={<TrendingUp className="text-green-400" size={20} />}
            />
          </div>

          {/* Streak & Progress */}
          <div className="grid md:grid-cols-2 gap-6">
            <StreakDisplay streak={stats.streak_count || 0} />
            <ProgressChart subjects={stats.subjects_progress || []} />
          </div>

          {/* AI Usage Stats */}
          <AIUsageStats />

          {/* Quick Stats Summary */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Flame className="text-orange-400" size={20} />
                Learning Activity
              </h2>
              <span className="text-xs text-slate-500 px-2 py-1 bg-white/5 rounded-full">
                Auto-updated
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs uppercase text-slate-400 mb-1">
                  AI Summaries Viewed
                </p>
                <p className="text-2xl font-bold text-blue-400">
                  {stats.posts_watched || 0}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-xs uppercase text-slate-400 mb-1">
                  Topics Created
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  {stats.subjects_created_count || 0}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                <p className="text-xs uppercase text-slate-400 mb-1">
                  Current Streak
                </p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.streak_count || 0} days
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;

