import { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import { HelpCircle, Loader2, Check, X } from 'lucide-react';

function AIQuiz({ postId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${postId}/ai-quiz`);
        setQuestions(data.questions || []);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    if (postId) loadQuiz();
  }, [postId]);

  if (loading) {
    return (
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5 text-[13px] text-[#666]">
        <div className="flex items-center gap-2">
          <Loader2 size={14} className="text-[#FF6B35] animate-spin" />
          Loading quiz...
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5 text-[12px] text-[#555]">
        Quiz not available for this video.
      </div>
    );
  }

  const q = questions[currentQ];
  const handleAnswer = (idx) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5 space-y-4">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#FF6B35]">
        <HelpCircle size={16} />
        QUICK QUIZ
      </div>
      <p className="text-[14px] text-white">{q.question}</p>
      <div className="space-y-2">
        {q.options?.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            disabled={showResult}
            className={`w-full text-left px-4 py-2.5 border text-[13px] transition-all ${
              showResult
                ? idx === q.correctIndex
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : selectedAnswer === idx
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-[#2a2a2a] text-[#666]'
                : 'border-[#2a2a2a] text-[#999] hover:border-[#FF6B35] hover:text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <button
          onClick={() => {
            setCurrentQ((currentQ + 1) % questions.length);
            setShowResult(false);
            setSelectedAnswer(null);
          }}
          className="text-[#FF6B35] text-[12px] font-semibold hover:underline"
        >
          Next Question →
        </button>
      )}
    </div>
  );
}

export default AIQuiz;
