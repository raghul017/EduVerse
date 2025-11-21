import { useEffect, useState } from "react";
import { usePostStore } from "../store/postStore.js";
import PostCard from "../components/feed/PostCard.jsx";

function Feed() {
  const { posts, fetchFeed } = usePostStore();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  useEffect(() => {
    if (!posts.length) {
      fetchFeed(true);
    }
  }, []);

  // Get unique subjects
  const subjects = Array.from(new Set(posts.map((post) => post.subject).filter(Boolean)));

  // Get unique creators (simplified - you might want to fetch actual creator data)
  const creators = Array.from(
    new Set(posts.map((post) => post.creator_id).filter(Boolean))
  ).slice(0, 10);

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (selectedSubject && post.subject !== selectedSubject) return false;
    if (selectedCreator && post.creator_id !== selectedCreator) return false;
    // Difficulty filter would need to be added to your post model
    return true;
  });

  // Suggested creators (top creators by post count)
  const suggestedCreators = posts
    .reduce((acc, post) => {
      const existing = acc.find((c) => c.id === post.creator_id);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ id: post.creator_id, name: post.creator_name || "Creator", count: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Trending topics (subjects with most posts)
  const trendingTopics = subjects
    .map((subject) => ({
      subject,
      count: posts.filter((p) => p.subject === subject).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="min-h-screen relative z-10">
      <div className="max-w-layout mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-textPrimary mb-4">Filters</h3>

              {/* Subjects */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-textSecondary mb-3 uppercase tracking-wide">
                  Subjects
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedSubject(null)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${
                      selectedSubject === null
                        ? "bg-accent/20 text-accent"
                        : "text-textSecondary hover:text-textPrimary hover:bg-surface"
                    }`}
                  >
                    All Subjects
                  </button>
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() =>
                        setSelectedSubject(
                          selectedSubject === subject ? null : subject
                        )
                      }
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${
                        selectedSubject === subject
                          ? "bg-accent/20 text-accent"
                          : "text-textSecondary hover:text-textPrimary hover:bg-surface"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Creators */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-textSecondary mb-3 uppercase tracking-wide">
                  Creators
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCreator(null)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${
                      selectedCreator === null
                        ? "bg-accent/20 text-accent"
                        : "text-textSecondary hover:text-textPrimary hover:bg-surface"
                    }`}
                  >
                    All Creators
                  </button>
                  {creators.map((creatorId) => {
                    const creator = suggestedCreators.find((c) => c.id === creatorId);
                    return (
                      <button
                        key={creatorId}
                        onClick={() =>
                          setSelectedCreator(
                            selectedCreator === creatorId ? null : creatorId
                          )
                        }
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${
                          selectedCreator === creatorId
                            ? "bg-accent/20 text-accent"
                            : "text-textSecondary hover:text-textPrimary hover:bg-surface"
                        }`}
                      >
                        {creator?.name || "Creator"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <h4 className="text-xs font-medium text-textSecondary mb-3 uppercase tracking-wide">
                  Difficulty
                </h4>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setDifficulty(difficulty === level ? null : level)
                      }
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${
                        difficulty === level
                          ? "bg-accent/20 text-accent"
                          : "text-textSecondary hover:text-textPrimary hover:bg-surface"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6 space-y-4">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-textPrimary mb-2">
                Educational Feed
              </h1>
              <p className="text-textSecondary text-sm">
                Discover bite-sized lessons from verified creators
              </p>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <p className="text-textSecondary">No posts found. Try adjusting your filters.</p>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Suggested Creators */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-textPrimary mb-4">
                Suggested Creators
              </h3>
              <div className="space-y-3">
                {suggestedCreators.map((creator) => (
                  <button
                    key={creator.id}
                    onClick={() => setSelectedCreator(creator.id)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-surface transition"
                  >
                    <span className="text-sm text-textSecondary">{creator.name}</span>
                    <span className="text-xs text-textSecondary">{creator.count} posts</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-textPrimary mb-4">
                Trending Topics
              </h3>
              <div className="space-y-2">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic.subject}
                    onClick={() => setSelectedSubject(topic.subject)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-surface transition"
                  >
                    <span className="text-sm text-textSecondary">{topic.subject}</span>
                    <span className="text-xs text-textSecondary">{topic.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Feed;

