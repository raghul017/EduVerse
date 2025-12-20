import { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import { Layers, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

function AIFlashcards({ postId }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${postId}/ai-flashcards`);
        setCards(data.flashcards || []);
      } catch {
        setCards([]);
      } finally {
        setLoading(false);
      }
    };
    if (postId) loadCards();
  }, [postId]);

  if (loading) {
    return (
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5 text-[13px] text-[#666]">
        <div className="flex items-center gap-2">
          <Loader2 size={14} className="text-[#FF6B35] animate-spin" />
          Loading flashcards...
        </div>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5 text-[12px] text-[#555]">
        Flashcards not available for this video.
      </div>
    );
  }

  const card = cards[currentCard];

  return (
    <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#FF6B35]">
          <Layers size={16} />
          FLASHCARDS
        </div>
        <span className="text-[11px] text-[#555] font-mono">{currentCard + 1}/{cards.length}</span>
      </div>
      
      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full p-4 border border-[#2a2a2a] hover:border-[#FF6B35] text-left transition-all min-h-[80px]"
      >
        <p className="text-[10px] text-[#555] uppercase tracking-wide mb-2 font-mono">
          {flipped ? 'ANSWER' : 'QUESTION'}
        </p>
        <p className="text-[13px] text-white">
          {flipped ? card.answer : card.question}
        </p>
      </button>
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setFlipped(false); }}
          disabled={currentCard === 0}
          className="p-2 text-[#555] hover:text-white disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-[11px] text-[#555]">Tap card to flip</span>
        <button
          onClick={() => { setCurrentCard(Math.min(cards.length - 1, currentCard + 1)); setFlipped(false); }}
          disabled={currentCard === cards.length - 1}
          className="p-2 text-[#555] hover:text-white disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default AIFlashcards;
