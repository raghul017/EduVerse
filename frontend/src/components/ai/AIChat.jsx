import { useState } from 'react';
import Button from '../common/Button.jsx';
import api from '../../utils/api.js';

function AIChat ({ postId }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);

  const handleAsk = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/posts/${postId}/ai-explain`, {
        question
      });
      setAnswer(data.answer);
      setSource(data.source);
    } catch (error) {
      setAnswer(error.response?.data?.message || 'AI is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-blue-400">🤖 Ask AI Tutor</h3>
      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Explain photosynthesis in simple terms..."
          className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </Button>
      </form>
      {answer && (
        <div className="border border-white/10 rounded p-3 space-y-1 bg-white/5">
          <div className="text-[10px] uppercase text-slate-400">
            {source === 'transcript'
              ? 'Response generated from transcript'
              : 'Transcript unavailable, using description'}
          </div>
          <p className="text-sm text-slate-400 whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default AIChat;
