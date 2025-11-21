import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Hash, Users, MessageSquare, Settings, Search, Bell, MoreVertical, Send } from "lucide-react";
import { useCommunityStore } from "../store/communityStore.js";
import CommunityChat from "../components/community/CommunityChat.jsx";
import CommunityFeed from "../components/community/CommunityFeed.jsx";
import Loader from "../components/common/Loader.jsx";

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
    return <div className="p-8 text-center">Community not found</div>;
  }

  if (!community) {
    return <Loader />;
  }

  return (
    <div className="flex h-[calc(100vh-80px)] -m-8 bg-background">
      {/* Channels Sidebar */}
      <aside className="w-64 bg-surface/30 border-r border-border flex flex-col">
        <div className="h-14 px-4 flex items-center justify-between border-b border-border hover:bg-surface/50 transition-colors cursor-pointer">
          <h1 className="font-bold text-textPrimary truncate">{community.name}</h1>
          <Settings size={16} className="text-textSecondary" />
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          <div className="px-2 pb-2">
            <p className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-1">
              Community
            </p>
            <button
              onClick={() => setActiveTab("feed")}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                activeTab === "feed"
                  ? "bg-accent/10 text-textPrimary"
                  : "text-textSecondary hover:bg-surface/50 hover:text-textPrimary"
              }`}
            >
              <Hash size={18} />
              <span className="font-medium">feed</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                activeTab === "chat"
                  ? "bg-accent/10 text-textPrimary"
                  : "text-textSecondary hover:bg-surface/50 hover:text-textPrimary"
              }`}
            >
              <MessageSquare size={18} />
              <span className="font-medium">general-chat</span>
            </button>
          </div>

          <div className="px-2 pb-2">
            <p className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-1">
              Information
            </p>
            <div className="px-2 py-1.5 text-textSecondary text-sm">
              <p className="line-clamp-3 text-xs leading-relaxed">
                {community.description}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-border bg-surface/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs font-medium text-success">
              {community.member_count} Online
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Header */}
        <header className="h-14 px-4 flex items-center justify-between border-b border-border bg-background">
          <div className="flex items-center gap-2">
            <Hash size={20} className="text-textSecondary" />
            <h2 className="font-bold text-textPrimary">
              {activeTab === "feed" ? "feed" : "general-chat"}
            </h2>
            {activeTab === "feed" && (
              <span className="text-xs text-textSecondary border-l border-border pl-2 ml-2">
                Community posts and updates
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-textSecondary" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-surface/50 border-none rounded-md py-1 pl-8 pr-2 text-sm text-textPrimary w-36 focus:w-56 transition-all focus:ring-1 focus:ring-accent"
              />
            </div>
            <Bell size={20} className="text-textSecondary hover:text-textPrimary cursor-pointer" />
            <Users 
              size={20} 
              className={`cursor-pointer transition-colors ${showMembers ? 'text-textPrimary' : 'text-textSecondary'}`}
              onClick={() => setShowMembers(!showMembers)} 
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
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
        <aside className="w-60 bg-surface/30 border-l border-border hidden xl:flex flex-col">
          <div className="p-4 border-b border-border h-14 flex items-center">
            <h3 className="font-bold text-textSecondary uppercase text-xs tracking-wider">
              Members — {community.member_count}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div>
              <p className="px-2 mb-2 text-xs font-bold text-textSecondary uppercase">Online</p>
              {/* Mock Online Users */}
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface/50 cursor-pointer opacity-50">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium text-textPrimary">Admin</p>
                  <p className="text-[10px] text-textSecondary">Playing VS Code</p>
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
