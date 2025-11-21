function StreakDisplay({ streak }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-surface p-6 text-center shadow-sm space-y-3">
      <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wide text-muted">
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
          🔥 Streak
        </span>
      </div>
      <p className="text-5xl font-bold text-primary leading-none">{streak}</p>
      <p className="text-sm text-muted">
        Keep learning every day to grow this number.
      </p>
    </div>
  );
}

export default StreakDisplay;
