import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Users, Plus } from "lucide-react";
import { useCommunityStore } from "../store/communityStore.js";
import Loader from "../components/common/Loader.jsx";

function Communities() {
  const { communities, fetchCommunities, loading, createCommunity } = useCommunityStore();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", description: "" });

  useEffect(() => {
    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    await createCommunity(form);
    setShowCreateModal(false);
    setForm({ name: "", subject: "", description: "" });
    fetchCommunities();
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-heading font-bold text-textPrimary mb-2">Discover Communities</h1>
            <p className="text-textSecondary text-lg">Find your study group and learn together.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-void hover:bg-gray-800 text-white rounded-xl font-bold transition-all shadow-lg"
          >
            <Plus size={20} />
            Create Community
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={20} />
          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border-2 border-border focus:border-void rounded-xl px-12 py-3 text-textPrimary placeholder-textMuted focus:outline-none transition-all"
          />
        </div>

        {/* Communities Grid */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <Link
                key={community.id}
                to={`/communities/${community.id}`}
                className="group p-6 bg-white border-2 border-border hover:border-void rounded-xl transition-all hover:shadow-xl"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-void flex items-center justify-center flex-shrink-0">
                    <Users size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-textPrimary text-lg mb-1 group-hover:text-void transition-colors">
                      {community.name}
                    </h3>
                    <p className="text-sm text-textMuted">{community.member_count || 0} members</p>
                  </div>
                </div>
                <p className="text-textSecondary line-clamp-2 leading-relaxed mb-4">
                  {community.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm font-medium text-void bg-gray-100 px-3 py-1 rounded-lg">
                    {community.subject}
                  </span>
                  <span className="text-sm text-textSecondary">
                    Join →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-textPrimary mb-4">Create Community</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:border-void focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:border-void focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Description</label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:border-void focus:outline-none h-24"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-void hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all">
                    Create
                  </button>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-muted text-textPrimary px-4 py-2 rounded-lg font-medium hover:bg-border transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Communities;

