import { Link } from "react-router-dom";

const formatDuration = (seconds) => {
  if (!seconds) return "Short";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

function VideoGridCard({ post }) {
  const thumbnail = post.thumbnail_url || "";
  const creatorInitial =
    post.creator_name?.slice(0, 2).toUpperCase() || post.subject?.[0] || "EV";

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group block space-y-3 transition-smooth hover-lift"
    >
      <div className="relative aspect-video  overflow-hidden bg-card border border-border">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-textSecondary text-sm">
            {post.subject || "EduVerse"}
          </div>
        )}
        <span className="absolute bottom-2 right-2 px-2 py-0.5 text-[11px] font-semibold bg-black/70 dark:bg-white/20 rounded text-white dark:text-textPrimary tracking-wide">
          {formatDuration(post.duration)}
        </span>
      </div>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-xs font-semibold text-textPrimary">
          {creatorInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-textPrimary leading-tight overflow-hidden">
            {post.title}
          </p>
          <p className="text-xs text-textSecondary mt-1">
            {post.creator_name || "EduVerse Creator"}
          </p>
          <p className="text-xs text-textSecondary">
            {post.views_count} views · {post.subject}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default VideoGridCard;


