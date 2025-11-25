import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useAuthStore } from "../state/store.js";
import StatsCard from "../components/dashboard/StatsCard.jsx";
import StreakDisplay from "../components/dashboard/StreakDisplay.jsx";
import ProgressChart from "../components/dashboard/ProgressChart.jsx";
import AIUsageStats from "../components/ai/AIUsageStats.jsx";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
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

  if (loading)
    return (
      <p className="text-center text-slate-400">Loading dashboard...</p>
    );
  if (error) return <p className="text-center text-red-400">{error}</p>;

  return (
    <div className="space-y-8">
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-sm backdrop-blur-sm space-y-3">
        <p className="text-sm uppercase tracking-wide text-slate-400">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Welcome back, {user?.name?.split(" ")[0] || "Learner"} 👋
        </h1>
        <p className="text-slate-400 text-base">
          Track how many lessons you’ve watched, which subjects you’re
          exploring, and keep your AI streak alive.
        </p>
      </section>

      {stats && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <StatsCard
              title="Posts watched"
              value={stats.posts_watched}
              subtitle="Across all devices"
            />
            <StatsCard
              title="Bookmarked"
              value={stats.bookmarks_count}
              subtitle="Saved for later"
            />
            <StatsCard
              title="Subjects explored"
              value={stats.subjects_count}
              subtitle="Unique topics unlocked"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <StreakDisplay streak={stats.streak_count} />
            <ProgressChart subjects={stats.subjects_progress} />
          </div>

          {/* AI Usage Stats */}
          <AIUsageStats />

          <section className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                AI activity
              </h2>
              <span className="text-xs text-slate-500">Auto-updated</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-white/10">
                <p className="text-xs uppercase text-slate-400">
                  AI summaries viewed
                </p>
                <p className="text-2xl font-semibold text-blue-400">
                  {Math.max(stats.posts_watched - stats.bookmarks_count, 0)}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs uppercase text-slate-400">
                  Community subjects
                </p>
                <p className="text-2xl font-semibold text-white">{stats.subjects_count}</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-500/10 border border-white/10">
                <p className="text-xs uppercase text-slate-400">
                  Current streak
                </p>
                <p className="text-2xl font-semibold text-green-400">
                  {stats.streak_count} days
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
