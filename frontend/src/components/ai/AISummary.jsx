import { useEffect, useState } from 'react';
import api from '../../utils/api.js';

const SourceBadge = ({ source }) => {
  if (!source) return null;
  const label = source === 'transcript' ? 'Transcript' : 'Description';
  const colorClass = source === 'transcript' ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10';
  return (
    <span className={`text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border border-white/10 ${colorClass}`}>
      Using {label}
    </span>
  );
};

function AISummary ({ postId }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${postId}/ai-summary`);
        setSummary(data.summary || 'AI summary unavailable.');
        setSource(data.source);
      } catch {
        setSummary('AI summary unavailable.');
      } finally {
        setLoading(false);
      }
    };
    if (postId) loadSummary();
  }, [postId]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
        <span>⚡ AI Summary</span>
        {loading && <span className="text-xs text-slate-400">thinking...</span>}
        {!loading && <SourceBadge source={source} />}
      </div>
      {source === 'description' && (
        <p className="text-[11px] text-yellow-400 bg-yellow-500/10 inline-flex px-2 py-1 rounded">
          Transcript still processing. Using description for now.
        </p>
      )}
      <p className="text-sm text-slate-400 whitespace-pre-line">{summary}</p>
    </div>
  );
}

export default AISummary;
