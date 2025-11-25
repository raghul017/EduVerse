import { Link } from "react-router-dom";

function PathCard({ path }) {
  return (
    <Link
      to={`/paths/${path.id}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 hover:border-blue-500/50 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-lg transition group"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-blue-400 group-hover:text-blue-300 transition">
            Learning path
          </p>
          <h3 className="text-base font-semibold text-white group-hover:text-blue-200 transition">{path.title}</h3>
          {path.subject && (
            <p className="text-xs text-slate-400">Subject: {path.subject}</p>
          )}
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>{path.lessons_count || 0} lessons</p>
          {path.level && <p className="mt-1 capitalize">{path.level}</p>}
        </div>
      </div>
      {path.description && (
        <p className="text-xs text-slate-400 line-clamp-3">{path.description}</p>
      )}
    </Link>
  );
}

export default PathCard;
