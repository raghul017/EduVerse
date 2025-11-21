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
    <div className="ev-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-accent">🤖 Ask AI Tutor</h3>
      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Explain photosynthesis in simple terms..."
          className="flex-1 ev-input rounded px-3 py-2 text-sm"
        />
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </Button>
      </form>
      {answer && (
        <div className="border border-border rounded p-3 space-y-1 bg-surface">
          <div className="text-[10px] uppercase text-textSecondary">
            {source === 'transcript'
              ? 'Response generated from transcript'
              : 'Transcript unavailable, using description'}
          </div>
          <p className="text-sm text-textSecondary whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default AIChat;
