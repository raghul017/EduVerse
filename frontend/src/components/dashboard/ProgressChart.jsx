function ProgressChart({ subjects = [] }) {
  return (
    <div className="bg-surface border border-slate-100/80 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text">Subjects explored</p>
        <span className="text-xs text-muted">{subjects.length} tracked</span>
      </div>
      {subjects.length === 0 ? (
        <p className="text-sm text-muted">
          Start watching lessons to unlock subject insights.
        </p>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => (
            <div key={subject.name}>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>{subject.name}</span>
                <span>{subject.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full"
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
