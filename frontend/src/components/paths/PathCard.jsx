import { Link } from "react-router-dom";

function PathCard({ path }) {
  return (
    <Link
      to={`/paths/${path.id}`}
      className="block rounded-2xl border border-slate-100/80 bg-surface p-4 space-y-2 hover:border-primary/60 hover:-translate-y-0.5 hover:shadow-lg transition"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-primary">
            Learning path
          </p>
          <h3 className="text-base font-semibold text-text">{path.title}</h3>
          {path.subject && (
            <p className="text-xs text-muted">Subject: {path.subject}</p>
          )}
        </div>
        <div className="text-right text-xs text-muted">
          <p>{path.lessons_count || 0} lessons</p>
          {path.level && <p className="mt-1 capitalize">{path.level}</p>}
        </div>
      </div>
      {path.description && (
        <p className="text-xs text-muted line-clamp-3">{path.description}</p>
      )}
    </Link>
  );
}

export default PathCard;
