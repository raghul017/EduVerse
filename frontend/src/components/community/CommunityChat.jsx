import { useEffect, useState, useRef } from "react";
import { Send, Trash2, Loader2 } from "lucide-react";
import api from "../../utils/api.js";
import { useAuthStore } from "../../store/authStore.js";

function CommunityChat({ communityId }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const load = async () => {
      if (!communityId) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/communities/${communityId}/messages`);
        setMessages(data.data || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [communityId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!input.trim() || !communityId || !user) return;
    setSending(true);
    try {
      await api.post(`/communities/${communityId}/messages`, {
        content: input.trim(),
      });
      const { data: refreshed } = await api.get(`/communities/${communityId}/messages`);
      setMessages(refreshed.data || []);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!communityId || !messageId) return;
    
    const previousMessages = [...messages];
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    
    try {
      await api.delete(`/communities/${communityId}/messages/${messageId}`);
    } catch (error) {
      setMessages(previousMessages);
      console.error("Failed to delete message:", error);
      alert(error.response?.data?.message || "Failed to delete message");
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-surface/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-white uppercase tracking-wider">Live Chat</span>
        </div>
        {loading && (
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="text-accent animate-spin" />
            <span className="text-xs text-textMuted font-mono">Loading...</span>
          </div>
        )}
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-surface/50 border border-border/30 flex items-center justify-center mb-4 backdrop-blur-md">
              <Send size={32} className="text-textMuted opacity-40" />
            </div>
            <p className="text-textSecondary text-[15px] font-semibold mb-1">No messages yet</p>
            <p className="text-textMuted text-[13px]">Be the first to start the conversation!</p>
          </div>
        )}
        
        {messages.map((msg) => {
          const isOwn = user && msg.user_id === user.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} group animate-in slide-in-from-bottom-2 fade-in duration-300`}
            >
              <div className="flex gap-3 max-w-[80%]">
                {!isOwn && (
                  <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0 shadow-lg shadow-accent/5">
                    {msg.user_name?.charAt(0) || 'U'}
                  </div>
                )}
                
                <div className={`flex-1 ${isOwn ? 'flex flex-col items-end' : ''}`}>
                  {!isOwn && (
                    <div className="text-[11px] font-bold text-accent mb-1.5 tracking-wide">
                      {msg.user_name}
                    </div>
                  )}
                  
                  <div
                    className={`relative px-5 py-3 rounded-2xl shadow-md transition-all group-hover:shadow-lg ${
                      isOwn 
                        ? "bg-accent text-black rounded-tr-sm shadow-accent/20" 
                        : "bg-surface/60 text-white border border-border/30 rounded-tl-sm backdrop-blur-md"
                    }`}
                  >
                    <div className="text-[14px] whitespace-pre-wrap break-words leading-relaxed">
                      {msg.content}
                    </div>
                    <div className={`text-[10px] font-mono mt-2 ${isOwn ? "text-black/50" : "text-textMuted"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    
                    {isOwn && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Delete this message?")) {
                            handleDelete(msg.id);
                          }
                        }}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0a0a0a] text-textMuted border border-border hover:text-red-400 hover:border-red-400/50 hover:bg-red-500/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg"
                        title="Delete message"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-surface/20 backdrop-blur-md">
        {!user ? (
          <div className="text-center py-3 bg-surface/50 rounded-2xl border border-border/30 backdrop-blur-md">
            <p className="text-textSecondary text-sm">
              Please <a href="/login" className="text-accent hover:underline font-bold">log in</a> to send messages
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-3">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-accent/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="relative w-full bg-surface/50 backdrop-blur-md border border-border rounded-full px-5 py-3 text-[14px] text-white placeholder:text-textMuted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="px-6 py-3 rounded-full bg-accent hover:bg-accent-hover disabled:bg-accent/30 disabled:cursor-not-allowed text-black text-[13px] font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:scale-105 active:scale-95 uppercase tracking-wider"
            >
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CommunityChat;
