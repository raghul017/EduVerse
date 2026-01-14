import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Hash, Users, MessageSquare, ArrowLeft, Loader2, Send, Trash2 } from "lucide-react";
import { useCommunityStore } from "../store/communityStore.js";
import { useAuthStore } from "../store/authStore.js";
import CommunityFeed from "../components/community/CommunityFeed.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";
import api from "../utils/api.js";

function CommunityDetail() {
  const { id } = useParams();
  const { communities, fetchCommunities } = useCommunityStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("chat");
  const [showMembers, setShowMembers] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (communities.length === 0) {
      fetchCommunities();
    }
  }, [communities.length, fetchCommunities]);

  // Load messages
  useEffect(() => {
    if (!id || activeTab !== "chat") return;
    
    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data } = await api.get(`/communities/${id}/messages`);
        setMessages(data.data || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    loadMessages();
    const interval = setInterval(loadMessages, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, [id, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !user) return;
    
    setSending(true);
    try {
      await api.post(`/communities/${id}/messages`, { content: chatInput.trim() });
      const { data } = await api.get(`/communities/${id}/messages`);
      setMessages(data.data || []);
      setChatInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Delete this message?")) return;
    
    const prev = [...messages];
    setMessages(messages.filter(m => m.id !== messageId));
    
    try {
      await api.delete(`/communities/${id}/messages/${messageId}`);
    } catch (error) {
      setMessages(prev);
      alert("Failed to delete message");
    }
  };

  const community = communities.find((c) => c.id === id);

  if (!community && communities.length > 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#666] text-[15px] mb-4">Community not found</p>
          <Link to="/communities" className="text-[#A1FF62] text-[13px] hover:underline font-semibold">
            ← Back to communities
          </Link>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="text-[#A1FF62] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-[#1f1f1f] bg-[#0f0f0f]/50 backdrop-blur-md sticky top-0 z-20">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/communities" className="text-[#666] hover:text-white transition-colors p-2 hover:bg-[#1a1a1a] rounded-lg">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">{community.name}</h1>
                <p className="text-[11px] text-[#666] font-mono uppercase">{community.subject}</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowMembers(!showMembers)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                showMembers 
                  ? "bg-[#A1FF62] text-black" 
                  : "bg-[#1a1a1a] text-[#666] hover:text-white border border-[#2a2a2a]"
              }`}
            >
              <Users size={16} />
              {showMembers ? "Hide" : "Show"} Members
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <div className={`grid transition-all duration-300 ${showMembers ? 'lg:grid-cols-[1fr,300px]' : 'grid-cols-1'} gap-0`}>
          
          {/* Main Area */}
          <div className="border-r border-[#1f1f1f]">
            {/* Tabs */}
            <div className="border-b border-[#1f1f1f] bg-[#0f0f0f]/30 px-6 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === "chat"
                      ? "bg-[#A1FF62] text-black"
                      : "text-[#666] hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  <MessageSquare size={16} />
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab("feed")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === "feed"
                      ? "bg-[#A1FF62] text-black"
                      : "text-[#666] hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  <Hash size={16} />
                  Posts
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="h-[calc(100vh-180px)]">
              {activeTab === "chat" ? (
                <div className="flex flex-col h-full">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loadingMessages && messages.length === 0 ? (
                      <div className="flex justify-center py-12">
                        <Loader2 size={24} className="text-[#A1FF62] animate-spin" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare size={48} className="text-[#333] mx-auto mb-3" />
                        <p className="text-[#666] text-[14px]">No messages yet</p>
                        <p className="text-[#444] text-[12px] mt-1">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = user && msg.user_id === user.id;
                        return (
                          <div key={msg.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""} group`}>
                            {!isOwn && (
                              <div className="w-10 h-10 rounded-full bg-[#A1FF62]/20 border border-[#A1FF62]/30 flex items-center justify-center text-[#A1FF62] font-bold text-sm flex-shrink-0">
                                {msg.user_name?.charAt(0) || "U"}
                              </div>
                            )}
                            <div className={`flex-1 max-w-[70%] ${isOwn ? "flex flex-col items-end" : ""}`}>
                              {!isOwn && (
                                <p className="text-[11px] font-bold text-[#A1FF62] mb-1">{msg.user_name}</p>
                              )}
                              <div className={`relative px-4 py-3 rounded-2xl ${
                                isOwn
                                  ? "bg-[#A1FF62] text-black rounded-tr-sm"
                                  : "bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-tl-sm"
                              }`}>
                                <p className="text-[14px] whitespace-pre-wrap break-words">{msg.content}</p>
                                <p className={`text-[10px] mt-1 ${isOwn ? "text-black/50" : "text-[#666]"}`}>
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                                {isOwn && (
                                  <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0a0a0a] border border-[#2a2a2a] text-[#666] hover:text-red-400 hover:border-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input */}
                  <div className="border-t border-[#1f1f1f] p-4 bg-[#0f0f0f]/50">
                    {user ? (
                      <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-5 py-3 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#A1FF62] focus:ring-1 focus:ring-[#A1FF62]/20"
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          disabled={sending || !chatInput.trim()}
                          className="px-6 py-3 bg-[#A1FF62] hover:bg-[#b8ff8a] disabled:bg-[#A1FF62]/30 text-black rounded-full font-bold text-[13px] flex items-center gap-2 transition-all uppercase tracking-wider"
                        >
                          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          {sending ? "Sending" : "Send"}
                        </button>
                      </form>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-[#666] text-[13px]">
                          <a href="/login" className="text-[#A1FF62] hover:underline font-semibold">Log in</a> to send messages
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <CommunityFeed communityId={id} />
                </div>
              )}
            </div>
          </div>

          {/* Members Sidebar */}
          <div className={`bg-[#0f0f0f]/30 transition-all duration-300 ease-in-out overflow-hidden ${
            showMembers ? 'w-[300px] opacity-100' : 'w-0 opacity-0'
          }`}>
            <div className="p-6 w-[300px]">
              <h3 className="text-[11px] font-mono text-[#666] uppercase tracking-wider mb-4">
                Members — {user && community.joined ? 1 : 0}
              </h3>
              <div className="space-y-3">
                {user && community.joined ? (
                  <div className="flex items-center gap-3 p-3 bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl">
                    <div className="w-10 h-10 bg-[#A1FF62] rounded-full flex items-center justify-center text-black font-bold text-sm">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-[#666]">Member</p>
                    </div>
                    <div className="w-2 h-2 bg-[#A1FF62] rounded-full"></div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users size={32} className="text-[#333] mx-auto mb-2" />
                    <p className="text-[12px] text-[#555]">Join to see members</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetail;
