import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Users, Plus, Loader2, X, MessageSquare, Hash } from "lucide-react";
import { useCommunityStore } from "../store/communityStore.js";
import { useAuthStore } from "../store/authStore.js";

function Communities() {
  const navigate = useNavigate();
  const { communities, loading, error, fetchCommunities, toggleMembership, createCommunity } = useCommunityStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", subject: "", description: "" });

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinLeave = async (e, community) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleMembership(community.id, community.joined);
    } catch {
      // Error handled by store
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!newCommunity.name.trim() || !newCommunity.subject.trim()) return;
    
    setCreating(true);
    try {
      const created = await createCommunity(newCommunity);
      setShowCreateModal(false);
      setNewCommunity({ name: "", subject: "", description: "" });
      navigate(`/communities/${created.id}`);
    } catch {
      // Error handled by store
    } finally {
      setCreating(false);
    }
  };

  const getSubjectEmoji = (subject) => {
    const emojiMap = {
      'programming': '💻', 'javascript': '🟨', 'python': '🐍', 'react': '⚛️',
      'design': '🎨', 'data': '📊', 'ai': '🤖', 'machine learning': '🧠',
      'web': '🌐', 'mobile': '📱', 'devops': '🔧', 'security': '🔒',
      'cloud': '☁️', 'database': '🗃️', 'frontend': '🖥️', 'backend': '⚙️'
    };
    const lower = subject?.toLowerCase() || '';
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lower.includes(key)) return emoji;
    }
    return '📚';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] text-[#FF6B35] mb-4 tracking-[0.15em] font-mono">
              <span className="w-2 h-2 bg-[#FF6B35] rounded-full"></span>
              [ LEARNING COMMUNITIES ]
            </div>
            <h1 className="text-[48px] font-bold text-white mb-4 leading-tight">
              Communities
            </h1>
            <p className="text-[#666] text-[16px] max-w-xl">
              Join communities to learn and discuss with others
            </p>
          </div>
          
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#FF6B35] hover:bg-[#ff7a4a] text-black font-bold text-[13px] transition-all"
            >
              <Plus size={16} /> CREATE COMMUNITY
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-10">
          <div className="max-w-md bg-[#111] border border-[#2a2a2a] flex items-center gap-3 px-4">
            <Search size={18} className="text-[#555]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..."
              className="flex-1 bg-transparent py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Communities Grid */}
        <div>
          <h2 className="text-[14px] font-mono text-[#FF6B35] mb-4 tracking-wide">&gt;_ ALL_COMMUNITIES</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-[#FF6B35] animate-spin" />
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="text-center py-20 bg-[#0f0f0f] border border-[#1f1f1f]">
              <Users size={48} className="text-[#333] mx-auto mb-4" />
              <p className="text-[#555] text-[14px]">No communities found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCommunities.map((community) => (
                <Link
                  key={community.id}
                  to={`/communities/${community.id}`}
                  className="group block"
                >
                  <div className="relative bg-[#0f0f0f] border border-[#1f1f1f] hover:border-[#333] p-5 transition-all">
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-[#FF6B35]"></div>
                    
                    <div className="pl-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getSubjectEmoji(community.subject)}</span>
                          <div>
                            <h3 className="font-bold text-white text-[16px] group-hover:text-[#FF6B35] transition-colors">
                              {community.name}
                            </h3>
                            <span className="text-[11px] text-[#555] font-mono uppercase">{community.subject}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-[#666] text-[13px] mb-4 line-clamp-2">
                        {community.description || "A community for learning and discussion"}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[11px] text-[#555]">
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {community.member_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={12} /> {community.post_count || 0}
                          </span>
                        </div>
                        
                        <button
                          onClick={(e) => handleJoinLeave(e, community)}
                          className={`px-3 py-1.5 text-[11px] font-semibold transition-all ${
                            community.joined
                              ? 'bg-[#1a1a1a] text-[#FF6B35] border border-[#FF6B35]'
                              : 'bg-[#FF6B35] text-black'
                          }`}
                        >
                          {community.joined ? 'JOINED' : 'JOIN'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-[#111] border border-[#2a2a2a] w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-white font-bold text-[16px]">Create Community</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[#555] hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCommunity} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">NAME</label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                  placeholder="Community name"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">SUBJECT</label>
                <input
                  type="text"
                  value={newCommunity.subject}
                  onChange={(e) => setNewCommunity({ ...newCommunity, subject: e.target.value })}
                  placeholder="e.g. React, Python, Machine Learning"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-[#555] mb-2 font-mono">DESCRIPTION</label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] px-4 py-3 text-white text-[14px] placeholder:text-[#444] focus:outline-none focus:border-[#FF6B35] resize-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={creating || !newCommunity.name.trim() || !newCommunity.subject.trim()}
                className="w-full px-5 py-3 bg-[#FF6B35] hover:bg-[#ff7a4a] disabled:opacity-40 text-black font-bold text-[13px] flex items-center justify-center gap-2 transition-all"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                CREATE COMMUNITY
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Communities;
