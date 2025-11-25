import { useEffect, useState } from "react";
import api from "../../utils/api.js";

function AIFlashcards({ postId }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!postId) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${postId}/ai-flashcards`);
        setCards(data.flashcards || []);
        setSource(data.source);
      } catch {
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-400 backdrop-blur-sm">
        Building flashcards...
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-400 backdrop-blur-sm">
        Flashcards are not available for this video yet.
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-sm">
      <div className="flex items-center justify-between text-sm">
        <h3 className="font-semibold text-blue-400">📚 Flashcards</h3>
        {source && (
          <span className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border border-white/10 text-slate-400">
            {source === "transcript" ? "Transcript" : "Description"}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {cards.map((card, index) => (
          <details
            key={index}
            className="group rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm cursor-pointer transition hover:border-blue-500/50 hover:bg-white/10"
          >
            <summary className="list-none flex items-center justify-between gap-2">
              <span className="font-medium text-white">{card.front}</span>
              <span className="text-[11px] text-slate-400 group-open:hidden">
                Show answer
              </span>
              <span className="text-[11px] text-slate-400 hidden group-open:inline">
                Hide answer
              </span>
            </summary>
            <div className="mt-2 text-slate-400 whitespace-pre-line">
              {card.back}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default AIFlashcards;
