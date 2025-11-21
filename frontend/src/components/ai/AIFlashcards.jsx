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
      <div className="ev-card p-4 text-sm text-textSecondary">
        Building flashcards...
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="ev-card p-4 text-xs text-textSecondary">
        Flashcards are not available for this video yet.
      </div>
    );
  }

  return (
    <div className="ev-card p-4 space-y-3">
      <div className="flex items-center justify-between text-sm">
        <h3 className="font-semibold text-accent">📚 Flashcards</h3>
        {source && (
          <span className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 border border-border text-textSecondary">
            {source === "transcript" ? "Transcript" : "Description"}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {cards.map((card, index) => (
          <details
            key={index}
            className="group rounded-lg border border-border bg-surface px-3 py-2 text-sm cursor-pointer transition hover:border-accent"
          >
            <summary className="list-none flex items-center justify-between gap-2">
              <span className="font-medium text-textPrimary">{card.front}</span>
              <span className="text-[11px] text-textSecondary group-open:hidden">
                Show answer
              </span>
              <span className="text-[11px] text-textSecondary hidden group-open:inline">
                Hide answer
              </span>
            </summary>
            <div className="mt-2 text-textSecondary whitespace-pre-line">
              {card.back}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default AIFlashcards;
