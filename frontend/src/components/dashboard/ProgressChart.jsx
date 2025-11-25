function ProgressChart({ subjects = [] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Subjects explored</p>
        <span className="text-xs text-slate-400">{subjects.length} tracked</span>
      </div>
      {subjects.length === 0 ? (
        <p className="text-sm text-slate-400">
          Start watching lessons to unlock subject insights.
        </p>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => (
            <div key={subject.name}>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{subject.name}</span>
                <span>{subject.progress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
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
