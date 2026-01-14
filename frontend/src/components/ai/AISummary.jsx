import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import { Sparkles, Loader2 } from 'lucide-react';

const SourceBadge = ({ source }) => {
  if (!source) return null;
  const label = source === 'transcript' ? 'Transcript' : 'Description';
  const colorClass = source === 'transcript' ? 'text-green-400' : 'text-yellow-400';
  return (
    <span className={`text-[10px] uppercase tracking-[0.1em] font-mono ${colorClass}`}>
      USING {label.toUpperCase()}
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
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#A1FF62]">
          <Sparkles size={16} />
          AI SUMMARY
        </div>
        {loading && <Loader2 size={14} className="text-[#A1FF62] animate-spin" />}
        {!loading && <SourceBadge source={source} />}
      </div>
      {source === 'description' && (
        <p className="text-[11px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 mb-3">
          Transcript still processing. Using description for now.
        </p>
      )}
      <p className="text-[13px] text-[#999] whitespace-pre-line leading-relaxed">{summary}</p>
    </div>
  );
}

export default AISummary;
