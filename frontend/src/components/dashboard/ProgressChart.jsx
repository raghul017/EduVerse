import { BarChart3 } from 'lucide-react';

function ProgressChart({ subjects = [] }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-[#FF6B35]" />
          <p className="text-[14px] font-semibold text-white">Subjects explored</p>
        </div>
        <span className="text-[11px] text-[#555] font-mono">{subjects.length} TRACKED</span>
      </div>
      
      {subjects.length === 0 ? (
        <p className="text-[13px] text-[#555] text-center py-6">
          Start watching lessons to unlock subject insights
        </p>
      ) : (
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.name}>
              <div className="flex justify-between text-[12px] mb-2">
                <span className="text-white">{subject.name}</span>
                <span className="text-[#FF6B35] font-mono">{subject.progress}%</span>
              </div>
              <div className="h-2 bg-[#1a1a1a]">
                <div
                  className="h-full bg-[#FF6B35] transition-all"
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProgressChart;
