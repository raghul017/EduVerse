import { useEffect, useState } from "react";
import api from "../../utils/api.js";

const SourcePill = ({ source }) =>
  source && (
    <span className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border border-border text-textSecondary">
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
      <div className="ev-card p-4 text-sm text-textSecondary">
        Generating quiz...
      </div>
    );
  }

  if (!quiz.length) {
    return (
      <div className="ev-card p-4 text-xs text-textSecondary">
        AI quiz is not available for this video yet.
      </div>
    );
  }

  return (
    <div className="ev-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-accent">🧠 Quick Quiz</h3>
        <SourcePill source={source} />
      </div>
      <div className="space-y-3">
        {quiz.map((question, index) => (
          <div key={index} className="space-y-2">
            <p className="text-sm text-textPrimary">{question.question}</p>
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
                          ? "bg-success/10 text-success border-success"
                          : "bg-danger/10 text-danger border-danger"
                        : "text-textSecondary border-border hover:border-accent"
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
