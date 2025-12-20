import { Loader2, Play } from "lucide-react";

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
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[12px] text-[#FF6B35] mb-4 tracking-[0.15em] font-mono">
            <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
            [ AI GENERATOR ]
          </div>
          <h1 className="text-[40px] font-bold text-white mb-3">{title}</h1>
          <p className="text-[#666] text-[15px]">{subtitle}</p>
        </div>

        {/* Terminal Input */}
        <div className="bg-[#111] border border-[#2a2a2a] mb-8">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
            <code className="text-[12px] text-[#555] tracking-wide font-mono">USER@EDUVERSE:~/GENERATE</code>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#555]"></div>
            </div>
          </div>
          
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <input
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-white text-[18px] placeholder:text-[#444] focus:outline-none font-mono"
            />

            {/* Format Selection */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-3 font-mono">
                SELECT FORMAT
              </label>
              <div className="grid grid-cols-3 gap-3">
                {formats.map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setActiveFormat(fmt.id)}
                    className={`p-4 border text-left transition-all ${
                      activeFormat === fmt.id
                        ? "border-[#FF6B35] bg-[#FF6B35]/10"
                        : "border-[#2a2a2a] hover:border-[#444]"
                    }`}
                  >
                    <div className="text-2xl mb-2">{fmt.icon}</div>
                    <div className="text-[13px] font-semibold text-white">
                      {fmt.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="answerQuestions"
                checked={answerQuestions}
                onChange={(e) => setAnswerQuestions(e.target.checked)}
                className="w-4 h-4 bg-[#0a0a0a] border border-[#2a2a2a] accent-[#FF6B35]"
              />
              <label htmlFor="answerQuestions" className="text-[13px] text-[#666]">
                Answer questions for a better outline
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full px-6 py-3 bg-[#FF6B35] hover:bg-[#ff7a4a] disabled:opacity-40 text-black font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> GENERATING...</>
              ) : (
                <><Play size={14} fill="currentColor" /> GENERATE</>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-[13px]">
            {error}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export default GeneratorLayout;
