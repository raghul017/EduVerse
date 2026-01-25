import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, User, Bot, ThumbsUp, Copy, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../utils/api.js";

function AiTutor() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
        const history = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
        const { data } = await api.post("/paths/ai-chat", {
            message: userMsg,
            context: history
        });
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
        setLoading(false);
    }
  };

  const startSession = (topic) => {
      setLoading(true);
      setTimeout(() => {
          setMessages([{ role: 'assistant', content: `Hello! I'm ready to help you learn **${topic}**. What would you like to know?` }]);
          setLoading(false);
      }, 500);
  };

  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    // ROOT LAYOUT: Preserving the "Holy Grail" scroll fix
    <div className="fixed inset-0 z-[100] h-[100dvh] w-screen bg-[#F5F5F7] text-[#1a1a1a] font-sans flex flex-col selection:bg-[#A1FF62] selection:text-black overflow-hidden overscroll-none">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#A1FF62]/10 blur-[120px] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      {/* HEADER - Compact h-14 with Glass */}
      <header className="flex-none h-14 border-b border-black/5 bg-white/70 backdrop-blur-xl flex items-center px-4 justify-between z-20 sticky top-0">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-1.5 hover:bg-black/5 rounded-full transition-colors group">
                <ArrowLeft size={18} className="text-black/60 group-hover:text-black transition-colors" />
            </button>
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#A1FF62] rounded-lg flex items-center justify-center font-bold text-[10px] shadow-sm shadow-[#A1FF62]/20 border border-white/20">AI</div>
                <div>
                   <div className="font-heading font-bold text-base leading-none">EduVerse <span className="text-black/40">Tutor</span></div>
                   <span className="text-[9px] font-mono uppercase tracking-widest text-[#A1FF62] brightness-75">Online</span>
                </div>
            </div>
        </div>
        {messages.length > 0 && (
            <button 
                onClick={() => setMessages([])} 
                className="text-[10px] font-bold text-black/40 hover:text-black hover:bg-black/5 px-3 py-1.5 rounded-md uppercase tracking-widest transition-all"
            >
                End Session
            </button>
        )}
      </header>

      {/* MAIN SCROLL AREA */}
      <main className="flex-1 min-h-0 relative flex flex-col">
        
        {messages.length === 0 ? (
            /* EMPTY STATE - Compact */
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="relative mb-6 group cursor-default">
                    <div className="absolute inset-0 bg-[#A1FF62] blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
                    <div className="relative w-16 h-16 bg-white rounded-2xl shadow-lg shadow-black/5 flex items-center justify-center border border-white/50 transform rotate-3 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                        <Sparkles size={28} className="text-[#A1FF62] fill-current" />
                    </div>
                </div>

                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 tracking-tight text-[#1a1a1a] leading-tight">
                    What do you want<br />to <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a1a] to-[#1a1a1a]/60">master</span> today?
                </h1>
                
                <p className="text-black/60 text-sm md:text-base mb-6 sm:mb-8 max-w-sm font-medium leading-relaxed px-4">
                    I'm here to help you debug code, understand complex topics, or generate personalized roadmaps.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); startSession(input || "General Learning"); }} className="w-full max-w-md relative mb-6 sm:mb-8 group px-4">
                    <div className="absolute inset-0 bg-black/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2" />
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. Explain React Hooks..."
                        className="relative w-full h-11 sm:h-12 pl-4 sm:pl-6 pr-12 bg-white rounded-full border border-black/5 shadow-xl shadow-black/5 focus:outline-none focus:ring-2 focus:ring-[#A1FF62]/50 text-sm sm:text-base placeholder:text-black/30 transition-all font-medium"
                        autoFocus
                    />
                    <button type="submit" className="absolute right-5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 aspect-square bg-[#1a1a1a] rounded-full text-[#A1FF62] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md">
                        <ArrowLeft size={16} className="rotate-180" />
                    </button>
                </form>

                <div className="flex flex-wrap gap-2 justify-center max-w-md px-4">
                    {["Python", "System Design", "Calculus", "React", "Docker"].map(topic => (
                        <button 
                            key={topic} 
                            onClick={() => startSession(topic)} 
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-black/5 rounded-full text-[10px] sm:text-xs font-bold text-black/60 hover:text-black hover:border-black/20 hover:shadow-md transition-all transform hover:-translate-y-0.5"
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            /* CHAT LIST - Compact */
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6 scroll-smooth pb-32" // Added padding-bottom to clear floating input
            >
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 md:gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-backwards`}>
                        
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-none shadow-sm ${m.role === 'assistant' ? 'bg-white border border-black/5 text-black' : 'bg-[#1a1a1a] text-white shadow-md'}`}>
                            {m.role === 'assistant' ? (
                                <div className="font-bold text-[10px]">AI</div>
                            ) : (
                                <User size={14} />
                            )}
                        </div>

                        {/* Content Bubble */}
                        <div className={`max-w-[85%] sm:max-w-[88%] md:max-w-[75%] space-y-1 group`}>
                            {m.role === 'assistant' && (
                                <div className="flex items-center gap-2 mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] font-bold text-black/40 uppercase tracking-wider">EduVerse AI</span>
                                </div>
                            )}
                            
                            <div className={`p-3 sm:p-4 rounded-2xl shadow-sm text-xs sm:text-sm md:text-[15px] leading-relaxed ${m.role === 'user' ? 'bg-[#1a1a1a] text-white rounded-tr-sm shadow-md' : 'bg-white border border-black/5 text-[#333] rounded-tl-sm shadow-sm'}`}>
                                {m.role === 'user' ? (
                                    <p className="font-medium">{m.content}</p>
                                ) : (
                                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[#FAFAFA] prose-pre:border prose-pre:border-black/5 prose-pre:text-[#1a1a1a] prose-pre:my-2 prose-code:text-[#D90429] prose-code:bg-black/5 prose-code:px-1 prose-code:rounded prose-strong:text-black">
                                        <ReactMarkdown>{m.content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>

                            {/* Assistant Actions */}
                            {m.role === 'assistant' && (
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-1 pt-1">
                                    <button 
                                        onClick={() => copyToClipboard(m.content, i)}
                                        className="p-1.5 hover:bg-black/5 rounded-md text-black/40 hover:text-black transition-colors flex items-center gap-1.5" 
                                        title="Copy"
                                    >
                                        {copiedIndex === i ? (
                                            <>
                                                <ThumbsUp size={12} className="text-green-600" />
                                                <span className="text-[9px] font-bold text-green-600">Copied</span>
                                            </>
                                        ) : (
                                            <Copy size={12} />
                                        )}
                                    </button>
                                    <button className="p-1.5 hover:bg-black/5 rounded-md text-black/40 hover:text-black transition-colors" title="Regenerate">
                                        <RefreshCw size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex gap-3 animate-pulse">
                         <div className="w-8 h-8 bg-white border border-black/5 rounded-lg flex items-center justify-center"><div className="w-1.5 h-1.5 bg-black/10 rounded-full"/></div>
                         <div className="bg-white border border-black/5 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center shadow-sm">
                            <div className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full animate-bounce" />
                         </div>
                    </div>
                )}
            </div>
        )}

      </main>

      {/* FLOATING FOOTER INPUT */}
      {messages.length > 0 && (
          <footer className="fixed bottom-4 sm:bottom-6 left-0 right-0 px-3 sm:px-4 md:px-0 z-30 pointer-events-none">
            <div className="max-w-3xl mx-auto w-full relative group pointer-events-auto">
                <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-lg translate-y-2" />
                <form onSubmit={handleSend} className="relative flex items-center bg-white/90 backdrop-blur-md rounded-full border border-black/10 shadow-2xl shadow-black/10 p-1.5 sm:p-2 transition-all focus-within:ring-4 focus-within:ring-[#A1FF62]/20 focus-within:border-[#A1FF62] focus-within:scale-[1.01]">
                    <div className="pl-2 sm:pl-3 pr-1 sm:pr-2 text-lg sm:text-xl animate-pulse">✨</div>
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a follow-up..."
                        className="flex-1 h-8 sm:h-10 bg-transparent border-none focus:ring-0 text-[#1a1a1a] placeholder:text-black/30 text-xs sm:text-sm font-medium px-1 sm:px-2"
                        autoFocus
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || loading} 
                        className="p-2 sm:p-2.5 bg-[#1a1a1a] text-[#A1FF62] rounded-full hover:bg-black disabled:opacity-50 disabled:hover:bg-[#1a1a1a] transition-all hover:scale-105 active:scale-95 shadow-md"
                    >
                        {loading ? <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#A1FF62] border-t-transparent rounded-full animate-spin" /> : <Send size={14} />}
                    </button>
                </form>
            </div>
          </footer>
      )}

    </div>
  );
}

export default AiTutor;
