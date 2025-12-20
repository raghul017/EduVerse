import { Flame } from 'lucide-react';

function StreakDisplay({ streak }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-6 text-center">
      <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#555] mb-4 font-mono">
        <Flame size={14} className="text-[#FF6B35]" />
        CURRENT STREAK
      </div>
      <p className="text-[56px] font-bold text-[#FF6B35] leading-none mb-2">{streak}</p>
      <p className="text-[13px] text-[#555]">
        Keep learning every day to grow this number
      </p>
    </div>
  );
}

export default StreakDisplay;
