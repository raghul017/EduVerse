import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { useAuthStore } from "../../state/store.js";

function CommunityChat({ communityId }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

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
    
    // Refresh messages every 5 seconds to get new messages
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!input.trim() || !communityId) return;
    setSending(true);
    try {
      const { data } = await api.post(`/communities/${communityId}/messages`, {
        content: input.trim(),
      });
      // Refresh all messages from backend to ensure consistency
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
    
    // Optimistically remove from UI
    const previousMessages = [...messages];
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    
    try {
      await api.delete(`/communities/${communityId}/messages/${messageId}`);
      // Refresh messages from backend to ensure consistency
      const { data } = await api.get(`/communities/${communityId}/messages`);
      setMessages(data.data || []);
    } catch (error) {
      // Revert on error
      setMessages(previousMessages);
      console.error("Failed to delete message:", error);
      alert(error.response?.data?.message || "Failed to delete message");
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between text-xs text-textSecondary">
        <span className="font-semibold text-textPrimary">Live chat</span>
        {loading && <span>Loading...</span>}
      </div>
      <div className="max-h-64 overflow-y-auto space-y-2 pr-1 text-xs custom-scrollbar">
        {messages.map((msg, index) => {
          const isOwn = user && msg.user_id === user.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-slide-up`}
            >
              <div
                className={`relative max-w-[80%] rounded-2xl px-3 py-2 transition-smooth ${
                  isOwn ? "bg-accent text-background" : "bg-card text-textPrimary"
                }`}
              >
                <div className="text-[10px] opacity-80 mb-0.5">
                  {isOwn ? "You" : msg.user_name}
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {msg.content}
                </div>
                {isOwn && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this message?")) {
                        handleDelete(msg.id);
                      }
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background text-[10px] text-textSecondary border border-border hover:text-danger hover:border-danger transition"
                    title="Delete message"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {!messages.length && !loading && (
          <p className="text-textSecondary">
            No messages yet. Start the conversation!
          </p>
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 text-xs">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Share a quick update or ask a question..."
          className="flex-1 bg-card border border-border rounded-full px-3 py-1.5 text-xs text-textPrimary focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={sending}
          className="px-3 py-1.5 rounded-full bg-accent text-background text-xs font-semibold disabled:opacity-60"
        >
          {sending ? "Sending" : "Send"}
        </button>
      </form>
    </div>
  );
}

export default CommunityChat;

