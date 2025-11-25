function StatsCard({ title, value, subtitle }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2 shadow-sm backdrop-blur-sm">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}

export default StatsCard;
