function StreakDisplay({ streak }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-sm space-y-3 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-slate-400">
        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-semibold">
          🔥 Streak
        </span>
      </div>
      <p className="text-5xl font-bold text-blue-400 leading-none">{streak}</p>
      <p className="text-sm text-slate-400">
        Keep learning every day to grow this number.
      </p>
    </div>
  );
}

export default StreakDisplay;
