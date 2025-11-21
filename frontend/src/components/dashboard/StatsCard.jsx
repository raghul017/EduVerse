function StatsCard({ title, value, subtitle }) {
  return (
    <div className="bg-surface border border-slate-100/80 rounded-2xl p-5 space-y-2 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted">{title}</p>
      <p className="text-3xl font-semibold text-text">{value}</p>
      <p className="text-sm text-muted">{subtitle}</p>
    </div>
  );
}

export default StatsCard;
