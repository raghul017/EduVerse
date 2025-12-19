function StatsCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-sm backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
        {icon && <div className="opacity-70">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

export default StatsCard;

