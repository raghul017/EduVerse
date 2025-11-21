import { useEffect } from "react";
import { usePostStore } from "../../store/postStore.js";
import PostCard from "./PostCard.jsx";
import Loader from "../common/Loader.jsx";

function FeedContainer({ searchQuery = "" }) {
  const { posts, fetchFeed, loading, error, hasMore } = usePostStore();

  useEffect(() => {
    if (!posts.length) {
      fetchFeed(true);
    }
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visiblePosts = normalizedQuery
    ? posts.filter((post) => {
        const inTitle = post.title?.toLowerCase().includes(normalizedQuery);
        const inSubject = post.subject?.toLowerCase().includes(normalizedQuery);
        const inTags = Array.isArray(post.tags)
          ? post.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
          : false;
        return inTitle || inSubject || inTags;
      })
    : posts;

  return (
    <section className="grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {visiblePosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {loading && <Loader label="Fetching knowledge..." />}
      {error && <p className="text-error text-sm">{error}</p>}
      {!hasMore && (
        <p className="text-center text-text/60 text-sm">
          You&apos;re all caught up! 🎉
        </p>
      )}
    </section>
  );
}

export default FeedContainer;
