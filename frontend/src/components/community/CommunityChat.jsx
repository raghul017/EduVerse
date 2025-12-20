import { useEffect, useState, useRef } from "react";
import { Send, Trash2 } from "lucide-react";
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
    
    const interval = setInterval(load, 5000);
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
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/20">
        <span className="text-sm font-semibold text-textPrimary">💬 Live Chat</span>
        {loading && <span className="text-xs text-textSecondary animate-pulse">Loading...</span>}
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-surface/50 flex items-center justify-center mb-4">
              <Send size={24} className="text-textSecondary" />
            </div>
            <p className="text-textSecondary text-sm">No messages yet</p>
            <p className="text-textSecondary/60 text-xs mt-1">Start the conversation!</p>
          </div>
        )}
        
        {messages.map((msg) => {
          const isOwn = user && msg.user_id === user.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}
            >
              <div
                className={`relative max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  isOwn 
                    ? "bg-accent text-white" 
                    : "bg-surface/50 text-textPrimary border border-border"
                }`}
              >
                {!isOwn && (
                  <div className="text-[10px] font-semibold text-accent mb-1">
                    {msg.user_name}
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {msg.content}
                </div>
                <div className={`text-[10px] mt-1.5 ${isOwn ? "text-white/70" : "text-textSecondary"}`}>
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
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background text-textSecondary border border-border hover:text-error hover:border-error/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                    title="Delete message"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t border-border bg-surface/20">
        {!user ? (
          <p className="text-center text-textSecondary text-sm">
            Please <a href="/login" className="text-accent hover:underline font-medium">log in</a> to send messages
          </p>
        ) : (
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
            >
              <Send size={16} />
              {sending ? "..." : "Send"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default CommunityChat;
