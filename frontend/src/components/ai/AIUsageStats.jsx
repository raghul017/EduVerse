import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import api from "../../utils/api";

export default function AIUsageStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/paths/ai-usage/stats");
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="bg-white/5 rounded-lg shadow p-6 animate-pulse border border-white/10">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-sm text-red-400">
          Failed to load usage stats: {error}
        </p>
      </div>
    );
  }

  const percentageUsed = (stats.tokensUsed / stats.dailyLimit) * 100;
  const isWarning = percentageUsed >= 80;
  const isCritical = percentageUsed >= 95;

  return (
    <div className="bg-white/5 rounded-lg shadow-sm p-6 space-y-4 border border-white/10 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">AI Usage Today</h3>
        </div>
        <button
          onClick={fetchStats}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Refresh stats"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-medium text-slate-400">
            {stats.tokensUsed.toLocaleString()} /{" "}
            {stats.dailyLimit.toLocaleString()} tokens
          </span>
          <span
            className={`text-sm font-semibold ${
              isCritical
                ? "text-red-400"
                : isWarning
                ? "text-yellow-400"
                : "text-blue-400"
            }`}
          >
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCritical
                ? "bg-red-500"
                : isWarning
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Warning Messages */}
      {isWarning && (
        <div
          className={`${
            isCritical
              ? "bg-red-500/10 border-red-500/20"
              : "bg-yellow-500/10 border-yellow-500/20"
          } border rounded-lg p-3 flex items-start gap-3`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 ${
              isCritical ? "text-red-400" : "text-yellow-400"
            }`}
          />
          <div>
            <p
              className={`text-sm font-medium ${
                isCritical ? "text-red-400" : "text-yellow-400"
              }`}
            >
              {isCritical ? "Critical Usage Level" : "High Usage Warning"}
            </p>
            <p
              className={`text-xs ${
                isCritical ? "text-red-300" : "text-yellow-300"
              }`}
            >
              {isCritical
                ? "You are approaching your daily AI limit. Usage will reset tomorrow."
                : "You have used over 80% of your daily AI credits."}
            </p>
          </div>
        </div>
      )}

      {/* Usage Breakdown */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-400">Total Requests</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.requestsCount}
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs text-slate-400">Tokens Remaining</span>
          <p
            className={`text-2xl font-bold ${
              isCritical
                ? "text-red-400"
                : isWarning
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {stats.remainingTokens.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Generation Stats */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Today's Activity
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-blue-500/10 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Roadmaps</p>
            <p className="text-xl font-bold text-blue-400">
              {stats.roadmapsGenerated}
            </p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Courses</p>
            <p className="text-xl font-bold text-purple-400">
              {stats.coursesGenerated}
            </p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Resources</p>
            <p className="text-xl font-bold text-green-400">
              {stats.resourcesGenerated}
            </p>
          </div>
        </div>
      </div>

      {/* Estimated Remaining Generations */}
      <div className="border-t border-white/10 pt-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Estimated Remaining Generations
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-sm text-slate-400 mb-1">Roadmaps</p>
            <p className="text-lg font-semibold text-white">
              {stats.canGenerate.roadmaps}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Courses</p>
            <p className="text-lg font-semibold text-white">
              {stats.canGenerate.courses}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Resources</p>
            <p className="text-lg font-semibold text-white">
              {stats.canGenerate.resources}
            </p>
          </div>
        </div>
      </div>

      {/* Reset Info */}
      <div className="border-t border-white/10 pt-4">
        <p className="text-xs text-slate-500">
          Usage resets in{" "}
          <span className="font-semibold text-slate-300">{stats.resetTime}</span>
        </p>
      </div>
    </div>
  );
}
