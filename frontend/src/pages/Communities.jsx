import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Users, Plus, Loader2, X, MessageSquare, TrendingUp, Activity } from "lucide-react";
import { useCommunityStore } from "../store/communityStore.js";
import { useAuthStore } from "../store/authStore.js";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";
import ScrollReveal from "../components/ui/ScrollReveal.jsx";

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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="bg-noise opacity-[0.03] absolute inset-0"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen animate-float-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen animate-float-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 pt-8 sm:pt-16">
        
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row items-start justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border mb-6 backdrop-blur-md">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-textSecondary">Learning Communities</span>
              </div>
              <h1 className="text-4xl sm:text-fluid-hero text-white mb-4 leading-none tracking-tighter">
                COMMUNITIES
              </h1>
              <p className="text-textSecondary text-base sm:text-xl max-w-xl text-balance">
                Join communities to learn, discuss, and connect with others who share your interests.
              </p>
            </div>
            
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="ev-button ev-button--primary text-xs uppercase tracking-wider py-3 px-6 flex items-center gap-2 font-bold"
              >
                <Plus size={16} /> Create Community
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* Search */}
        <ScrollReveal delay={0.1}>
          <div className="mb-8 sm:mb-12 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-surface/50 backdrop-blur-md border border-border rounded-full shadow-lg focus-within:border-accent/50 transition-all">
                <Search size={18} className="text-textMuted flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search communities..."
                  className="flex-1 bg-transparent text-white text-sm sm:text-[15px] placeholder:text-textDisabled focus:outline-none font-medium"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Communities Grid */}
        <div>
          <ScrollReveal delay={0.2}>
            <h2 className="text-sm font-mono text-textMuted mb-8 tracking-wide flex items-center gap-2">
              <TrendingUp size={14} /> ALL COMMUNITIES
            </h2>
          </ScrollReveal>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-accent animate-spin" />
            </div>
          ) : filteredCommunities.length === 0 ? (
            <ScrollReveal delay={0.3}>
              <div className="text-center py-20 bg-surface/30 border border-border rounded-3xl backdrop-blur-md">
                <Users size={48} className="text-textDisabled mx-auto mb-4 opacity-40" />
                <p className="text-textMuted text-[15px]">No communities found</p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community, idx) => (
                <ScrollReveal key={community.id} delay={0.3 + idx * 0.05}>
                  <Link to={`/communities/${community.id}`} className="group block">
                    <SpotlightCard className="p-6 hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-2xl border border-accent/20 shadow-lg shadow-accent/5">
                            {getSubjectEmoji(community.subject)}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-[17px] group-hover:text-accent transition-colors leading-tight">
                              {community.name}
                            </h3>
                            <span className="text-[11px] text-textMuted font-mono uppercase tracking-wider">{community.subject}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-textSecondary text-[14px] mb-6 line-clamp-2 flex-1 leading-relaxed">
                        {community.description || "A community for learning and discussion"}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-4 text-[12px] text-textMuted">
                          <span className="flex items-center gap-1.5">
                            <Users size={13} /> {community.member_count || 0}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MessageSquare size={13} /> {community.post_count || 0}
                          </span>
                        </div>
                        
                        <button
                          onClick={(e) => handleJoinLeave(e, community)}
                          className={`px-4 py-2 text-[11px] font-bold transition-all rounded-full ${
                            community.joined
                              ? 'bg-surface text-accent border border-accent/30 hover:bg-accent/10'
                              : 'bg-accent text-black hover:bg-accent-hover shadow-md shadow-accent/20'
                          }`}
                        >
                          {community.joined ? 'JOINED' : 'JOIN'}
                        </button>
                      </div>
                    </SpotlightCard>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-surface/90 backdrop-blur-xl border border-border w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <h2 className="text-white font-bold text-[18px] tracking-tight">Create Community</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-textMuted hover:text-white transition-colors p-2 hover:bg-surface-hover rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCommunity} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-textMuted mb-2 font-mono">Community Name</label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                  placeholder="React Developers"
                  className="w-full bg-background/50 border border-border px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-white text-sm sm:text-[15px] placeholder:text-textDisabled focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-textMuted mb-2 font-mono">Subject</label>
                <input
                  type="text"
                  value={newCommunity.subject}
                  onChange={(e) => setNewCommunity({ ...newCommunity, subject: e.target.value })}
                  placeholder="e.g. React, Python, Machine Learning"
                  className="w-full bg-background/50 border border-border px-4 py-3 rounded-2xl text-white text-[15px] placeholder:text-textDisabled focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[11px] uppercase tracking-[0.15em] text-textMuted mb-2 font-mono">Description</label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                  placeholder="Brief description..."
                  rows={4}
                  className="w-full bg-background/50 border border-border px-4 py-3 rounded-2xl text-white text-[15px] placeholder:text-textDisabled focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 resize-none transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={creating || !newCommunity.name.trim() || !newCommunity.subject.trim()}
                className="w-full px-5 py-3 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-[13px] flex items-center justify-center gap-2 transition-all rounded-full shadow-lg shadow-accent/20 uppercase tracking-wider"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Create Community
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Communities;
