function StatsCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5 hover:border-[#333] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#555] font-mono">{title}</p>
        {icon && <div className="text-[#FF6B35]">{icon}</div>}
      </div>
      <p className="text-[32px] font-bold text-white mb-1">{value}</p>
      <p className="text-[12px] text-[#555]">{subtitle}</p>
    </div>
  );
}

export default StatsCard;
