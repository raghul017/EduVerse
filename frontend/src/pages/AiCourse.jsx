import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import api from "../utils/api.js";

const presetTopics = [
  "Frontend Development",
  "Backend Development",
  "Fullstack Web",
  "Data Science",
  "Machine Learning",
];

function AiCourse() {
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [format, setFormat] = useState("course");
  const [answerQuestions, setAnswerQuestions] = useState(false);

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setCourse(null);
    try {
      const endpoint = format === "course" ? "/paths/ai-course" : "/paths/ai-roadmap";
      const payload = format === "course" ? { topic } : { role: topic };
      const { data } = await api.post(endpoint, payload);
      console.log("AI response", data.data);
      setCourse(data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "AI service is unavailable right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const modules = course?.modules || [];
  const stages = course?.stages || [];

  return (
    <div className="min-h-screen flex relative z-10 bg-[#0a0a0a]">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">AI Tutor</div>
              <div className="text-xs text-slate-400">by EduVerse</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Your personalized learning companion for any topic
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">
              Create with AI
            </div>
            <NavLink
              to="/ai-course"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-blue-500/10 text-blue-500"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span>Plan</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase font-semibold">
                NEW
              </span>
            </NavLink>
            <NavLink
              to="/ai-course"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "text-textSecondary hover:text-textPrimary hover:bg-card"
                }`
              }
            >
              Course
            </NavLink>
            <NavLink
              to="/ai-course"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "text-textSecondary hover:text-textPrimary hover:bg-card"
                }`
              }
            >
              Guide
            </NavLink>
            <NavLink
              to="/ai-roadmap"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "text-textSecondary hover:text-textPrimary hover:bg-card"
                }`
              }
            >
              Roadmap
            </NavLink>
            <NavLink
              to="/ai-course"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "text-textSecondary hover:text-textPrimary hover:bg-card"
                }`
              }
            >
              Quiz
            </NavLink>
          </div>

          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">
              My Learning
            </div>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/5 transition">
              <span>My Courses</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/5 transition">
              Ask AI Tutor
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/5 transition">
              Roadmap Chat
            </button>
          </div>

          <div className="mb-4">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-textSecondary hover:text-textPrimary hover:bg-card transition">
              Staff Picks
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-textSecondary hover:text-textPrimary hover:bg-card transition">
              Community
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            to="/signup"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-sm font-medium text-white hover:bg-white/10 transition"
          >
            <span>Free Signup or Login</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-semibold text-white mb-2">
          What can I help you learn?
        </h1>
          <p className="text-slate-400 mb-8">
            Enter a topic below to generate a personalized course for it
          </p>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Input Field */}
            <div>
              <input
                type="text"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Enter a topic"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">
                Choose the format
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "course", label: "Course", icon: "📚" },
                  { id: "guide", label: "Guide", icon: "📄" },
                  { id: "roadmap", label: "Roadmap", icon: "🗺️" },
                ].map((fmt) => (
              <button
                    key={fmt.id}
                type="button"
                    onClick={() => setFormat(fmt.id)}
                    className={`p-4 border rounded-lg transition text-left ${
                      format === fmt.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-2xl mb-2">{fmt.icon}</div>
                    <div className="text-sm font-medium text-white">{fmt.label}</div>
              </button>
            ))}
          </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id="answerQuestions"
                checked={answerQuestions}
                onChange={(e) => setAnswerQuestions(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="answerQuestions" className="text-sm text-slate-400">
                Answer the following questions for a better course
              </label>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
          </div>
          )}

          {/* Course/Roadmap Results */}
      {course && (
            <div className="mt-12 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-2">
                <h2 className="text-2xl font-semibold text-white">{course.title}</h2>
            {course.description && (
                  <p className="text-slate-400">{course.description}</p>
            )}
          </div>

              {format === "course" && modules.length > 0 && (
          <div className="space-y-4">
            {modules.map((mod) => (
              <div
                key={mod.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
              >
                  <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                      Module
                    </p>
                        <h3 className="text-sm font-semibold text-white">{mod.title}</h3>
                    {mod.summary && (
                          <p className="text-xs text-slate-400 mt-1">{mod.summary}</p>
                    )}
                </div>
                <div className="space-y-2">
                  {mod.lessons?.map((lesson) => (
                    <div
                      key={lesson.id}
                            className="border border-white/10 rounded-md p-3 bg-white/5 space-y-1"
                    >
                            <p className="text-sm font-semibold text-white">
                        {lesson.title}
                      </p>
                      {lesson.objective && (
                              <p className="text-xs text-slate-400">{lesson.objective}</p>
                      )}
                      {lesson.suggestedResources?.length > 0 && (
                              <div className="mt-2 space-y-1">
                          {lesson.suggestedResources.map((res, idx) => (
                            <div
                              key={`${lesson.id}-res-${idx}`}
                                    className="text-[11px] text-slate-400 flex items-center gap-1"
                            >
                                    <span className="uppercase tracking-wide">{res.type}</span>
                              {res.title && <span>· {res.title}</span>}
                              {res.url && (
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noreferrer"
                                        className="text-blue-400 underline-offset-2 hover:underline ml-1"
                                >
                                  Open
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
                </div>
              )}

              {format === "roadmap" && stages.length > 0 && (
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-4 min-w-full">
                    {stages.map((stage) => (
                      <div
                        key={stage.id}
                        className="flex-1 min-w-[220px] bg-white/5 border border-white/10 rounded-lg p-4 space-y-3"
                      >
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                            Stage
                          </p>
                          <h3 className="text-sm font-semibold text-white">{stage.label}</h3>
                          {stage.summary && (
                            <p className="text-xs text-slate-400 mt-1">{stage.summary}</p>
                          )}
                        </div>
                        <div className="space-y-3">
                          {stage.nodes?.map((node) => (
                            <div
                              key={node.id}
                              className="border border-white/10 rounded-md p-3 bg-white/5 space-y-1"
                            >
                              <p className="text-sm font-semibold text-white">
                                {node.label}
                              </p>
                              {node.details && (
                                <p className="text-xs text-slate-400 whitespace-pre-wrap">
                                  {node.details}
                                </p>
                              )}
                              {node.dependsOn?.length > 0 && (
                                <p className="text-[10px] text-slate-500 mt-1">
                                  Depends on: {node.dependsOn.join(", ")}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {((format === "course" && !modules.length) ||
                (format === "roadmap" && !stages.length)) && (
                <div className="text-sm text-slate-500 text-center py-8">
                  AI returned an empty result. Please try again with a different topic.
              </div>
            )}
          </div>
      )}
        </div>
      </main>
    </div>
  );
}

export default AiCourse;
