import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { 
  Heart, Bookmark, Share2, Eye, Clock, ArrowLeft, 
  ThumbsUp, MessageSquare, Download, Flag 
} from 'lucide-react';
import VideoPlayer from "../components/feed/VideoPlayer.jsx";
import AISummary from "../components/ai/AISummary.jsx";
import AIQuiz from "../components/ai/AIQuiz.jsx";
import AIFlashcards from "../components/ai/AIFlashcards.jsx";
import AIChat from "../components/ai/AIChat.jsx";
import Button from "../components/ui/Button.jsx";
import IconButton from "../components/ui/IconButton.jsx";
import api from "../utils/api.js";
import { usePostStore } from "../store/postStore.js";
import { useAuthStore } from "../store/authStore.js";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleLike, toggleBookmark } = usePostStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Post not found.");
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like videos');
      return;
    }
    await toggleLike(post.id);
    // Refresh post to get updated like count
    const { data } = await api.get(`/posts/${id}`);
    setPost(data.data);
  };

  const handleBookmark = async () => {
    if (!user) {
      alert('Please login to bookmark videos');
      return;
    }
    await toggleBookmark(post.id);
    // Refresh post to get updated bookmark status
    const { data } = await api.get(`/posts/${id}`);
    setPost(data.data);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger text-lg mb-4">{error}</p>
        <Button onClick={() => navigate('/videos')}>Back to Videos</Button>
      </div>
    );
  }

  if (!post) return null;

  const transcriptReady = Boolean(post.transcript && post.transcript.length > 20);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr),minmax(0,1fr)]">
        {/* Main video + metadata */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl">
            <VideoPlayer
              source={post.video_url}
              thumbnail={post.thumbnail_url}
              title={post.title}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-textPrimary leading-tight mb-3">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-textSecondary">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accentHover flex items-center justify-center text-white text-xs font-bold">
                    {post.creator_name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-semibold text-textPrimary">{post.creator_name || 'Creator'}</span>
                </div>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views_count || 0} views
                </span>
                {post.duration && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.round(post.duration / 60)} min
                    </span>
                  </>
                )}
                <span>·</span>
                <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-xs font-medium">
                  {post.subject}
                </span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
              <Button
                variant={post.liked ? 'secondary' : 'primary'}
                size="md"
                onClick={handleLike}
                className="flex items-center gap-2"
              >
                <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                <span>{post.likes_count || 0}</span>
                <span className="hidden sm:inline">{post.liked ? 'Liked' : 'Like'}</span>
              </Button>
              <Button
                variant={post.bookmarked ? 'secondary' : 'ghost'}
                size="md"
                onClick={handleBookmark}
                className="flex items-center gap-2"
              >
                <Bookmark className={`w-5 h-5 ${post.bookmarked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{post.bookmarked ? 'Saved' : 'Save'}</span>
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <div className="ml-auto flex items-center gap-2">
                {post.tags?.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs px-2.5 py-1 rounded-md bg-surface text-textSecondary border border-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-sm">
              <h3 className="font-semibold text-textPrimary text-lg">About this lesson</h3>
              <p className="text-textSecondary leading-relaxed whitespace-pre-wrap">
                {post.description}
              </p>
              {!transcriptReady && (
                <div className="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning">
                  <span>⏳</span>
                  <span>Transcript is still processing; AI features will use the description for now.</span>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* AI tutor side panel */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          <AISummary postId={post.id} transcriptReady={transcriptReady} />
          <AIQuiz postId={post.id} transcriptReady={transcriptReady} />
          <AIFlashcards postId={post.id} transcriptReady={transcriptReady} />
          <AIChat postId={post.id} transcriptReady={transcriptReady} />
        </motion.aside>
      </div>
    </div>
  );
}

export default PostDetail;