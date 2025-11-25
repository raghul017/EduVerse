import Button from "../common/Button.jsx";
import AIUsageStats from "./AIUsageStats.jsx";

function GeneratorLayout({
  title,
  subtitle,
  topic,
  setTopic,
  placeholder,
  formats,
  activeFormat,
  setActiveFormat,
  answerQuestions,
  setAnswerQuestions,
  loading,
  error,
  onSubmit,
  children,
}) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] flex">
      <main className="flex-1 p-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-semibold text-white mb-2">
            {title}
          </h1>
          <p className="text-slate-400 mb-8">{subtitle}</p>

          {/* AI Usage Stats */}
          <div className="mb-6">
            <AIUsageStats />
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">
                Choose the format
              </label>
              <div className="grid grid-cols-3 gap-4">
                {formats.map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setActiveFormat(fmt.id)}
                    className={`p-4 border rounded-lg transition text-left ${
                      activeFormat === fmt.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-2xl mb-2">{fmt.icon}</div>
                    <div className="text-sm font-medium text-white">
                      {fmt.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="answerQuestions"
                checked={answerQuestions}
                onChange={(e) => setAnswerQuestions(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500"
              />
              <label
                htmlFor="answerQuestions"
                className="text-sm text-slate-400"
              >
                Answer the following questions for a better outline
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading || !topic.trim()}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading ? "Generating..." : "✨ Generate"}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}

export default GeneratorLayout;
