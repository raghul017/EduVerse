import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../utils/api.js";

function PathDetail() {
  const { id } = useParams();
  const [path, setPath] = useState(null);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/paths/${id}`);
        setPath(data.data);
        setError(null);
        setSelectedIndex(0);
      } catch (err) {
        setError(err.response?.data?.message || "Path not found.");
      }
    };
    load();
  }, [id]);

  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (!path)
    return <p className="text-center text-slate-400">Loading roadmap...</p>;

  const lessons = path.lessons || [];
  const activeLesson = lessons[selectedIndex] || null;

  return (
    <div className="space-y-6">
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm backdrop-blur-sm space-y-2">
        <p className="text-xs uppercase tracking-wide text-slate-400">Roadmap</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          {path.title}
        </h1>
        <p className="text-sm text-slate-500">
          {path.subject && (
            <span className="mr-3">Subject: {path.subject}</span>
          )}
          {path.level && <span className="mr-3">Level: {path.level}</span>}
          <span>{lessons.length} steps</span>
        </p>
        {path.description && (
          <p className="text-sm text-slate-400 mt-1">{path.description}</p>
        )}
      </section>

      <section className="grid md:grid-cols-[minmax(0,1.1fr),minmax(0,1.3fr)] gap-6 items-start">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-4 shadow-sm backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
            Steps
          </p>
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-full border text-sm transition ${
                  index === selectedIndex
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-blue-500/40 hover:bg-white/10"
                }`}
              >
                <span className="text-[11px] uppercase text-slate-500">
                  Step {index + 1}
                </span>
                <span className="font-medium line-clamp-1">{lesson.title}</span>
              </button>
            ))}
            {!lessons.length && (
              <p className="text-xs text-slate-400">
                This path has no steps yet.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-sm backdrop-blur-sm space-y-4 min-h-[220px]">
          {activeLesson ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Selected topic
                  </p>
                  <h2 className="text-lg font-semibold text-white">
                    {activeLesson.title}
                  </h2>
                  {activeLesson.subject && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Subject: {activeLesson.subject}
                    </p>
                  )}
                </div>
                <Link
                  to={`/posts/${activeLesson.id}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Open video
                </Link>
              </div>
              {activeLesson.description && (
                <p className="text-sm text-slate-400">
                  {activeLesson.description}
                </p>
              )}
              <div className="border-t border-white/10 pt-3 space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Recommendations
                </p>
                {activeLesson.resources ? (
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">
                    {activeLesson.resources}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    No extra resources added for this step yet.
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              Select a step from the roadmap to see details and suggestions.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default PathDetail;
