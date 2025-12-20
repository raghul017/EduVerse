import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Hash, Users, MessageSquare, Settings, ArrowLeft, Send, Loader2 } from "lucide-react";
import { useCommunityStore } from "../store/communityStore.js";
import CommunityChat from "../components/community/CommunityChat.jsx";
import CommunityFeed from "../components/community/CommunityFeed.jsx";

function CommunityDetail() {
  const { id } = useParams();
  const { communities, fetchCommunities } = useCommunityStore();
  const [activeTab, setActiveTab] = useState("chat");
  const [showMembers, setShowMembers] = useState(true);

  useEffect(() => {
    if (communities.length === 0) {
      fetchCommunities();
    }
  }, [communities.length, fetchCommunities]);

  const community = communities.find((c) => c.id === id);

  if (!community && communities.length > 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#555] text-[14px] mb-4">Community not found</p>
          <Link to="/communities" className="text-[#FF6B35] text-[13px] hover:underline">
            ← Back to communities
          </Link>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] bg-[#0a0a0a]">
      {/* Channels Sidebar */}
      <aside className="w-64 bg-[#0f0f0f] border-r border-[#1f1f1f] flex flex-col">
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#1f1f1f]">
          <Link to="/communities" className="text-[#555] hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-bold text-white truncate flex-1 ml-3">{community.name}</h1>
          <Settings size={16} className="text-[#555]" />
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          <div className="px-2 pb-2">
            <p className="text-[10px] font-mono text-[#555] uppercase tracking-[0.15em] mb-2">
              CHANNELS
            </p>
            <button
              onClick={() => setActiveTab("feed")}
              className={`w-full flex items-center gap-2 px-3 py-2 transition-colors text-left ${
                activeTab === "feed"
                  ? "bg-[#FF6B35]/10 text-[#FF6B35] border-l-2 border-[#FF6B35]"
                  : "text-[#999] hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <Hash size={16} />
              <span className="text-[13px] font-medium">feed</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center gap-2 px-3 py-2 transition-colors text-left ${
                activeTab === "chat"
                  ? "bg-[#FF6B35]/10 text-[#FF6B35] border-l-2 border-[#FF6B35]"
                  : "text-[#999] hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <MessageSquare size={16} />
              <span className="text-[13px] font-medium">general-chat</span>
            </button>
          </div>

          <div className="px-2 pb-2 pt-4">
            <p className="text-[10px] font-mono text-[#555] uppercase tracking-[0.15em] mb-2">
              ABOUT
            </p>
            <div className="px-3 py-2 text-[12px] text-[#666] leading-relaxed">
              {community.description || "No description"}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-[11px] font-mono text-green-500">
              {community.member_count} ONLINE
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        {/* Header */}
        <header className="h-14 px-4 flex items-center justify-between border-b border-[#1f1f1f] bg-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <Hash size={18} className="text-[#555]" />
            <h2 className="font-bold text-white">
              {activeTab === "feed" ? "feed" : "general-chat"}
            </h2>
            {activeTab === "feed" && (
              <span className="text-[11px] text-[#555] border-l border-[#2a2a2a] pl-2 ml-2">
                Community posts and updates
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Users 
              size={18} 
              className={`cursor-pointer transition-colors ${showMembers ? 'text-[#FF6B35]' : 'text-[#555]'}`}
              onClick={() => setShowMembers(!showMembers)} 
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          {activeTab === "feed" ? (
            <div className="p-6 max-w-3xl mx-auto">
              <CommunityFeed communityId={id} />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <CommunityChat communityId={id} />
            </div>
          )}
        </div>
      </main>

      {/* Members Sidebar */}
      {showMembers && (
        <aside className="w-60 bg-[#0f0f0f] border-l border-[#1f1f1f] hidden xl:flex flex-col">
          <div className="p-4 border-b border-[#1f1f1f] h-14 flex items-center">
            <h3 className="font-mono text-[#555] uppercase text-[10px] tracking-[0.15em]">
              MEMBERS — {community.member_count}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div>
              <p className="px-2 mb-2 text-[10px] font-mono text-[#555] uppercase tracking-[0.15em]">Online</p>
              <div className="flex items-center gap-2 px-2 py-2 hover:bg-[#1a1a1a] cursor-pointer">
                <div className="w-8 h-8 bg-[#FF6B35] flex items-center justify-center text-black text-[12px] font-bold">
                  A
                </div>
                <div>
                  <p className="text-[13px] font-medium text-white">Admin</p>
                  <p className="text-[10px] text-[#555]">Playing VS Code</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default CommunityDetail;
