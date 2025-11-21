import { useEffect, useMemo, useState } from "react";
import CommunityFeed from "../components/community/CommunityFeed.jsx";
import CommunityChat from "../components/community/CommunityChat.jsx";
import { useCommunityStore } from "../state/store.js";

const initialForm = { name: "", subject: "", description: "" };
const friendTabs = [
  { id: "friends", label: "Friends", count: 0 },
  { id: "online", label: "Online", count: 0 },
  { id: "pending", label: "Pending", count: 0 },
  { id: "suggestions", label: "Suggestions", count: 0 },
];

function Communities() {
  const {
    communities,
    loading,
    error,
    fetchCommunities,
    createCommunity,
    toggleMembership,
  } = useCommunityStore();
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFriendTab, setActiveFriendTab] = useState("friends");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchCommunities();
    // Load online users and friends (mock data for now)
    setOnlineUsers([
      { id: "1", name: "Alex", status: "online" },
      { id: "2", name: "Sarah", status: "online" },
    ]);
    setFriends([
      { id: "1", name: "Alex", status: "online", mutualCommunities: 2 },
      { id: "2", name: "Sarah", status: "online", mutualCommunities: 1 },
      { id: "3", name: "Mike", status: "offline", mutualCommunities: 3 },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only set initial community if we don't have one selected and communities are loaded
    if (!selectedCommunity && communities.length > 0) {
      setSelectedCommunity(communities[0].id);
    }
  }, [communities.length, selectedCommunity]);

  const stats = useMemo(() => {
    const totalMembers = communities.reduce(
      (sum, community) => sum + (community.member_count || 0),
      0
    );
    return {
      totalCommunities: communities.length,
      totalSubjects: new Set(communities.map((c) => c.subject)).size,
      totalMembers,
    };
  }, [communities]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (
      !form.name.trim() ||
      !form.subject.trim() ||
      form.description.trim().length < 10
    ) {
      setFormError(
        "Provide a name, subject, and a description of at least 10 characters."
      );
      return;
    }
    setFormError(null);
    setFormLoading(true);
    try {
      const created = await createCommunity({
        name: form.name.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
      });
      setForm(initialForm);
      setShowCreateModal(false);
      setSelectedCommunity(created.id);
      await fetchCommunities();
    } catch (error) {
      // handled in store
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleMembership = async (community, event) => {
    if (event) {
      event.stopPropagation();
    }
    try {
      await toggleMembership(community.id, community.joined);
      // Refresh communities to get updated member counts
      await fetchCommunities();
    } catch (error) {
      console.error("Failed to toggle membership:", error);
    }
  };

  const activeCommunity = communities.find(
    (community) => community.id === selectedCommunity
  );

  return (
    <div className="-mx-6 -mt-4 h-[calc(100vh-80px)] bg-background text-textPrimary flex animate-fade-in">
      <aside className="hidden md:flex w-20 flex-col items-center gap-3 border-r border-border bg-surface/80 py-4">
        <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center text-background text-sm font-bold">
          EV
        </div>
        {communities.map((community, index) => (
          <button
            key={community.id}
            onClick={() => {
              console.log("Selecting community:", community.id, community.name);
              setSelectedCommunity(community.id);
            }}
            className={`w-11 h-11 rounded-2xl text-xs font-semibold flex items-center justify-center truncate border border-transparent transition-smooth hover-lift animate-scale-in ${
              selectedCommunity === community.id
                ? "bg-card text-textPrimary border-accent scale-105"
                : "bg-card/60 text-textSecondary hover:bg-card"
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {community.name.charAt(0).toUpperCase()}
          </button>
        ))}
        <button 
          onClick={() => setShowCreateModal(true)}
          className="w-11 h-11 rounded-2xl bg-card/60 text-textSecondary text-xl flex items-center justify-center hover:bg-card transition"
          title="Create community"
        >
          +
        </button>
      </aside>

      <section className="hidden lg:flex w-72 flex-col border-r border-border bg-surface/80">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-base font-semibold">Communities</h2>
          <p className="text-xs text-textSecondary">
            {stats.totalCommunities} total · {stats.totalMembers} members
          </p>
        </div>
        <div className="px-3 py-2 border-b border-border flex gap-2 text-xs text-textSecondary">
          {friendTabs.map((tab) => {
            const count = tab.id === "online" 
              ? onlineUsers.length 
              : tab.id === "friends" 
              ? friends.length 
              : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFriendTab(tab.id)}
                className={`px-3 py-1 rounded-full transition ${
                  activeFriendTab === tab.id 
                    ? "bg-card text-textPrimary" 
                    : "hover:bg-card"
                }`}
              >
                {tab.label} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
        {/* Friends/Online/Suggestions Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {activeFriendTab === "online" && (
            <>
              {onlineUsers.length > 0 ? (
                onlineUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-card/60 transition"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-background text-xs font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-surface"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-textPrimary">{user.name}</p>
                      <p className="text-[10px] text-textSecondary">Online</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-textSecondary text-center py-4">No one online</p>
              )}
            </>
          )}
          {activeFriendTab === "friends" && (
            <>
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-card/60 transition"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-background text-xs font-semibold">
                        {friend.name.charAt(0)}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${
                        friend.status === "online" ? "bg-success" : "bg-textSecondary"
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-textPrimary">{friend.name}</p>
                      <p className="text-[10px] text-textSecondary">
                        {friend.mutualCommunities} mutual communities
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-textSecondary text-center py-4">No friends yet</p>
              )}
            </>
          )}
          {activeFriendTab === "suggestions" && (
            <p className="text-xs text-textSecondary text-center py-4">
              Friend suggestions coming soon
            </p>
          )}
          {activeFriendTab === "pending" && (
            <p className="text-xs text-textSecondary text-center py-4">
              No pending requests
            </p>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 max-h-[400px]">
          {loading && (
            <p className="text-xs text-textSecondary">Loading communities...</p>
          )}
          {error && <p className="text-xs text-danger">{error}</p>}
          {communities.map((community, index) => (
            <button
              key={community.id}
              onClick={() => {
                console.log("Selecting community:", community.id, community.name);
                setSelectedCommunity(community.id);
              }}
              className={`w-full text-left rounded-xl border border-border px-3 py-3 transition-smooth hover-lift animate-slide-up ${
                selectedCommunity === community.id
                  ? "bg-card border-accent shadow-hover"
                  : "bg-card/40 hover:bg-card/60"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-textPrimary">{community.name}</span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggleMembership(community, event);
                  }}
                  className={`px-2 py-0.5 text-[11px] rounded-full border transition ${
                    community.joined
                      ? "border-border text-textSecondary hover:border-danger hover:text-danger"
                      : "border-accent text-accent hover:bg-accent/10"
                  }`}
                >
                  {community.joined ? "Joined" : "Join"}
                </button>
              </div>
              <p className="text-xs text-textSecondary uppercase tracking-wide mt-1">
                {community.subject} · {community.member_count || 0} members
              </p>
              <p className="text-xs text-textSecondary mt-1 line-clamp-2">
                {community.description}
              </p>
            </button>
          ))}
          {!loading && !communities.length && (
            <p className="text-xs text-textSecondary">
              No communities yet. Create one!
            </p>
          )}
        </div>
      </section>

      <main className="flex-1 flex flex-col bg-background">
        <header className="h-14 border-b border-border px-6 flex items-center justify-between">
          {activeCommunity ? (
            <>
              <div>
                <h1 className="text-lg font-semibold">
                  {activeCommunity.name}
                </h1>
                <p className="text-xs text-textSecondary">
                  Text channels · voice · study sessions
                </p>
              </div>
              <div className="text-xs text-textSecondary">
                {activeCommunity.member_count || 0} members
              </div>
            </>
          ) : (
            <p className="text-sm text-textSecondary">
              Select a community to open its channels.
            </p>
          )}
        </header>

        <div className="flex-1 grid xl:grid-cols-[minmax(0,1.8fr),minmax(0,1fr)]">
          <div className="overflow-y-auto px-6 py-6 space-y-4 border-r border-border">
            {selectedCommunity && activeCommunity ? (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-textPrimary mb-2">
                    Community Feed
                  </h3>
                  <CommunityFeed communityId={selectedCommunity} />
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-textPrimary mb-2">
                    Chat - {activeCommunity.name}
                  </h3>
                  <CommunityChat key={selectedCommunity} communityId={selectedCommunity} />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-textSecondary">
                  Select a community from the sidebar to see posts and start chatting.
                </p>
              </div>
            )}
          </div>

          <aside className="bg-surface/80 border-l border-border px-6 py-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase text-textSecondary tracking-wide">
                  Community
                </p>
                <h3 className="text-lg font-semibold text-textPrimary">
                  {activeCommunity?.name || "Select a community"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-background text-sm font-semibold hover:bg-accentHover transition"
              >
                <span>+</span>
                <span>Create</span>
              </button>
            </div>
            {activeCommunity && (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-textSecondary uppercase tracking-wide">Subject</p>
                  <p className="text-textPrimary font-medium">{activeCommunity.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-textSecondary uppercase tracking-wide">Members</p>
                  <p className="text-textPrimary font-medium">{activeCommunity.member_count || 0}</p>
                </div>
                {activeCommunity.description && (
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wide">About</p>
                    <p className="text-textPrimary text-sm">{activeCommunity.description}</p>
                  </div>
                )}
              </div>
            )}
          </aside>
          
          {/* Create Community Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
              <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-textPrimary">Create Community</h3>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="text-textSecondary hover:text-textPrimary text-xl"
                  >
                    ×
                  </button>
                </div>
                <form className="space-y-3" onSubmit={handleCreate}>
                  <label className="space-y-1 block text-sm text-textSecondary">
                    Name
                    <input
                      className="ev-input"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Data Science Circle"
                      required
                    />
                  </label>
                  <label className="space-y-1 block text-sm text-textSecondary">
                    Subject
                    <input
                      className="ev-input"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="AI / Machine Learning"
                      required
                    />
                  </label>
                  <label className="space-y-1 block text-sm text-textSecondary">
                    Description
                    <textarea
                      className="ev-input min-h-[100px] resize-none"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Share lessons, playlists, and challenges focused on..."
                      required
                    />
                  </label>
                  {formError && <p className="text-sm text-danger">{formError}</p>}
                  <button
                    type="submit"
                    className="ev-button ev-button--primary w-full"
                    disabled={formLoading}
                  >
                    {formLoading ? "Creating..." : "Create community"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Communities;


