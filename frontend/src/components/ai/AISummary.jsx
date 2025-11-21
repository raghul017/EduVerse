import { useEffect, useState } from 'react';
import api from '../../utils/api.js';

const SourceBadge = ({ source }) => {
  if (!source) return null;
  const label = source === 'transcript' ? 'Transcript' : 'Description';
  const colorClass = source === 'transcript' ? 'text-success bg-success/10' : 'text-warning bg-warning/10';
  return (
    <span className={`text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border border-border ${colorClass}`}>
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
    <div className="ev-card p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-accent">
        <span>⚡ AI Summary</span>
        {loading && <span className="text-xs text-textSecondary">thinking...</span>}
        {!loading && <SourceBadge source={source} />}
      </div>
      {source === 'description' && (
        <p className="text-[11px] text-warning bg-warning/10 inline-flex px-2 py-1 rounded">
          Transcript still processing. Using description for now.
        </p>
      )}
      <p className="text-sm text-textSecondary whitespace-pre-line">{summary}</p>
    </div>
  );
}

export default AISummary;
