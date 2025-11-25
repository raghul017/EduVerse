import { useEffect, useState } from "react";
import api from "../../utils/api.js";

const SourcePill = ({ source }) =>
  source && (
    <span className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border border-white/10 text-slate-400">
      {source === "transcript" ? "Transcript" : "Description"}
    </span>
  );

function AIQuiz({ postId }) {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${postId}/ai-quiz`);
        setQuiz(data.quiz || []);
        setSource(data.source);
      } catch {
        setQuiz([]);
      } finally {
        setLoading(false);
      }
    };
    if (postId) loadQuiz();
  }, [postId]);

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-400 backdrop-blur-sm">
        Generating quiz...
      </div>
    );
  }

  if (!quiz.length) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-400 backdrop-blur-sm">
        AI quiz is not available for this video yet.
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-blue-400">🧠 Quick Quiz</h3>
        <SourcePill source={source} />
      </div>
      <div className="space-y-3">
        {quiz.map((question, index) => (
          <div key={index} className="space-y-2">
            <p className="text-sm text-white">{question.question}</p>
            <div className="grid gap-2">
              {question.options.map((option, optionIndex) => {
                const selected = answers[index] === optionIndex;
                const isCorrect = question.correct === optionIndex;
                return (
                  <button
                    key={optionIndex}
                    className={`text-left text-xs px-3 py-2 rounded border transition ${
                      selected
                        ? isCorrect
                          ? "bg-green-500/10 text-green-400 border-green-500/50"
                          : "bg-red-500/10 text-red-400 border-red-500/50"
                        : "text-slate-400 border-white/10 hover:border-blue-500/50 hover:text-white"
                    }`}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [index]: optionIndex,
                      }))
                    }
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIQuiz;
