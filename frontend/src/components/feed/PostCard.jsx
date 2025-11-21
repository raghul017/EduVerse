import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import { usePostStore } from '../../store/postStore.js';
import { useAuthStore } from '../../store/authStore.js';

const Pill = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-surface border border-border text-textSecondary',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-medium ${variants[variant]}`}>{children}</span>
  );
};

function PostCard ({ post }) {
  const { toggleLike, toggleBookmark, deletePost } = usePostStore();
  const { user } = useAuthStore();
  const isOwner = user?.id === post.creator_id;

  const handleDelete = async () => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await deletePost(post.id);
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete right now.');
    }
  };

  return (
    <article className="rounded-lg border border-border bg-card shadow-card hover:shadow-hover transition overflow-hidden">
      <VideoPlayer source={post.video_url} thumbnail={post.thumbnail_url} title={post.title} />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3 justify-between text-xs">
          <Pill>{post.subject}</Pill>
          <div className="flex items-center gap-2 text-textSecondary">
            <span>{post.duration ? `${Math.round(post.duration / 60)} min` : 'Short lesson'}</span>
            <Pill variant={post.transcript_ready ? 'success' : 'warning'}>
              {post.transcript_ready ? 'Transcript ready' : 'Analyzing audio'}
            </Pill>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="text-danger text-[11px] uppercase tracking-wide hover:text-danger/80 transition"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-textPrimary">{post.title}</h3>
          <p className="text-textSecondary text-sm mt-2 max-h-16 overflow-hidden text-ellipsis">
            {post.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-textSecondary">
          <Link to={`/profile/${post.creator_id}`} className="text-textPrimary font-semibold hover:text-accent transition">
            {post.creator_name || 'Creator'}
          </Link>
          <div className="flex gap-4 text-xs">
            <span>{post.views_count} views</span>
            <span>{post.likes_count} likes</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant={post.liked ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => toggleLike(post.id)}
          >
            {post.liked ? 'Liked' : 'Like'}
          </Button>
          <Button
            variant={post.bookmarked ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => toggleBookmark(post.id)}
          >
            {post.bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Link to={`/posts/${post.id}`} className="ml-auto text-accent text-sm font-semibold flex items-center gap-2 hover:text-accentHover transition">
            AI Tutor
            {!post.transcript_ready && <span className="text-[10px] uppercase">beta</span>}
            →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
