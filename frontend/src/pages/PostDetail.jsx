import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Heart, Bookmark, Share2, Eye, Clock, ArrowLeft, 
  Loader2
} from 'lucide-react';
import VideoPlayer from "../components/feed/VideoPlayer.jsx";
import AISummary from "../components/ai/AISummary.jsx";
import AIQuiz from "../components/ai/AIQuiz.jsx";
import AIFlashcards from "../components/ai/AIFlashcards.jsx";
import AIChat from "../components/ai/AIChat.jsx";
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
    const { data } = await api.get(`/posts/${id}`);
    setPost(data.data);
  };

  const handleBookmark = async () => {
    if (!user) {
      alert('Please login to bookmark videos');
      return;
    }
    await toggleBookmark(post.id);
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
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 size={32} className="text-[#FF6B35] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-red-400 text-[16px] mb-4">{error}</p>
          <Link to="/videos" className="text-[#FF6B35] text-[13px] hover:underline">
            ← Back to Videos
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const transcriptReady = Boolean(post.transcript && post.transcript.length > 20);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#666] hover:text-white text-[13px] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          BACK
        </button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2.2fr),minmax(0,1fr)]">
          {/* Main video + metadata */}
          <section className="space-y-6">
            <div className="relative overflow-hidden bg-black">
              <VideoPlayer
                source={post.video_url}
                thumbnail={post.thumbnail_url}
                title={post.title}
              />
            </div>
            
            <div className="space-y-5">
              <div>
                <h1 className="text-[24px] md:text-[28px] font-bold text-white leading-tight mb-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#666]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FF6B35] flex items-center justify-center text-black font-bold text-[12px]">
                      {post.creator_name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-semibold text-white">{post.creator_name || 'Creator'}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {post.views_count || 0} views
                  </span>
                  {post.duration && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {Math.round(post.duration / 60)} min
                    </span>
                  )}
                  <span className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#FF6B35] text-[11px] font-mono uppercase">
                    {post.subject}
                  </span>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1f1f1f]">
                <button
                  onClick={handleLike}
                  className={`px-4 py-2 flex items-center gap-2 text-[13px] font-semibold transition-all ${
                    post.liked 
                      ? 'bg-[#FF6B35] text-black' 
                      : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#999] hover:text-white hover:border-[#FF6B35]'
                  }`}
                >
                  <Heart size={16} className={post.liked ? 'fill-current' : ''} />
                  {post.likes_count || 0}
                </button>
                <button
                  onClick={handleBookmark}
                  className={`px-4 py-2 flex items-center gap-2 text-[13px] font-semibold transition-all ${
                    post.bookmarked 
                      ? 'bg-[#FF6B35] text-black' 
                      : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#999] hover:text-white hover:border-[#FF6B35]'
                  }`}
                >
                  <Bookmark size={16} className={post.bookmarked ? 'fill-current' : ''} />
                  {post.bookmarked ? 'SAVED' : 'SAVE'}
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 flex items-center gap-2 text-[13px] font-semibold bg-[#1a1a1a] border border-[#2a2a2a] text-[#999] hover:text-white hover:border-[#FF6B35] transition-all"
                >
                  <Share2 size={16} />
                  SHARE
                </button>
                <div className="ml-auto flex items-center gap-2">
                  {post.tags?.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[11px] px-2 py-1 bg-[#111] border border-[#2a2a2a] text-[#666] font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Description */}
              <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-6 space-y-3">
                <h3 className="text-[14px] font-mono text-[#FF6B35] tracking-wide">&gt;_ ABOUT_THIS_LESSON</h3>
                <p className="text-[#999] leading-relaxed text-[14px] whitespace-pre-wrap">
                  {post.description}
                </p>
                {!transcriptReady && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 text-[12px] text-yellow-400">
                    ⏳ Transcript is still processing; AI features will use the description for now.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* AI tutor side panel */}
          <aside className="space-y-4">
            <AISummary postId={post.id} transcriptReady={transcriptReady} />
            <AIQuiz postId={post.id} transcriptReady={transcriptReady} />
            <AIFlashcards postId={post.id} transcriptReady={transcriptReady} />
            <AIChat postId={post.id} transcriptReady={transcriptReady} />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;