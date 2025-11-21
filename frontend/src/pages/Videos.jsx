import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../state/store.js";
import VideoGridCard from "../components/feed/VideoGridCard.jsx";

const primaryNav = [
  "Home",
  "Shorts",
  "Subscriptions",
  "Library",
  "History",
  "Your videos",
  "Watch later",
  "Liked videos",
];

const categories = [
  "All",
  "AI",
  "Math",
  "Science",
  "Backend",
  "Frontend",
  "DevOps",
  "Design",
  "Business",
  "Recently uploaded",
  "Watched",
];

function Videos() {
  const { posts, fetchFeed, loading, error } = usePostStore();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!posts.length) {
      fetchFeed(true);
    }
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return posts;
    if (activeCategory === "Recently uploaded") {
      return [...posts].sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
    }
    if (activeCategory === "Watched") {
      return posts.filter((post) => post.views_count > 0);
    }
    return posts.filter((post) =>
      (post.subject || "").toLowerCase().includes(activeCategory.toLowerCase())
    );
  }, [posts, activeCategory]);

  return (
    <div className="-mx-6 -mt-4 flex bg-background text-textPrimary min-h-[calc(100vh-80px)] animate-fade-in">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-surface/80 py-6">
        <div className="px-6 mb-4 text-xs uppercase text-textSecondary tracking-wide">
          Browse
        </div>
        <nav className="flex-1 px-4 space-y-1 text-sm">
          {primaryNav.map((item, index) => (
            <button
              key={item}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                index === 0
                  ? "bg-card text-textPrimary"
                  : "text-textSecondary hover:bg-card"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="px-4 mt-auto text-xs text-textSecondary">
          Inspired by YouTube layout
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full border text-xs whitespace-nowrap transition ${
                  activeCategory === category
                    ? "bg-accent text-background border-accent"
                    : "bg-card border-border text-textSecondary hover:border-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="w-10 h-10 rounded-full bg-card border border-border text-2xl font-semibold text-textPrimary hover:border-accent hover:text-accent transition flex items-center justify-center"
            title="Upload video"
          >
            +
          </button>
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <VideoGridCard post={post} />
            </div>
          ))}
        </div>

        {loading && (
          <p className="text-sm text-textSecondary">Loading videos...</p>
        )}
        {!loading && !filteredPosts.length && (
          <p className="text-sm text-textSecondary">
            No videos match this filter. Try a different category.
          </p>
        )}
      </main>
    </div>
  );
}

export default Videos;

