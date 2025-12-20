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

  // Get subject emoji based on name
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
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Communities</h1>
            <p className="text-slate-400">Join communities to learn and discuss with others</p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              <Plus size={18} />
              Create Community
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-white/10 rounded-xl mb-4" />
                <div className="h-5 w-32 bg-white/10 rounded mb-2" />
                <div className="h-4 w-full bg-white/10 rounded mb-4" />
                <div className="h-8 w-20 bg-white/10 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchCommunities} className="mt-2 text-sm text-red-300 underline">
              Try again
            </button>
          </div>
        )}

        {/* Communities Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunities.map(community => (
              <Link
                key={community.id}
                to={`/communities/${community.id}`}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-2xl">
                    {getSubjectEmoji(community.subject)}
                  </div>
                  <button
                    onClick={(e) => handleJoinLeave(e, community)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      community.joined
                        ? "bg-white/10 text-slate-300 hover:bg-red-500/20 hover:text-red-400"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {community.joined ? "Leave" : "Join"}
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                  {community.name}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                  {community.description || `Discuss everything about ${community.subject}`}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {community.member_count || 0} members
                  </span>
                  <span className="flex items-center gap-1">
                    <Hash size={14} />
                    {community.subject}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCommunities.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="mx-auto text-slate-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No communities found</h3>
            <p className="text-slate-400 mb-4">
              {searchQuery ? "Try a different search term" : "Be the first to create a community!"}
            </p>
            {user && !searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Create Community
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Community</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCommunity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g., React Developers"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g., React"
                  value={newCommunity.subject}
                  onChange={(e) => setNewCommunity({ ...newCommunity, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  placeholder="What's this community about?"
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={creating || !newCommunity.name.trim() || !newCommunity.subject.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {creating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Community"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Communities;
