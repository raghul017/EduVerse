import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../components/feed/VideoPlayer.jsx";
import AISummary from "../components/ai/AISummary.jsx";
import AIQuiz from "../components/ai/AIQuiz.jsx";
import AIFlashcards from "../components/ai/AIFlashcards.jsx";
import AIChat from "../components/ai/AIChat.jsx";
import api from "../utils/api.js";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Post not found.");
      }
    };
    loadPost();
  }, [id]);

  if (error)
    return <p className="text-center text-danger mt-8 text-sm">{error}</p>;
  if (!post)
    return (
      <p className="text-center text-textSecondary mt-8 text-sm">Loading...</p>
    );

  const transcriptReady = Boolean(
    post.transcript && post.transcript.length > 20
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr),minmax(0,1fr)]">
      {/* Main video + metadata */}
      <section className="space-y-4">
        <div className="bg-black rounded-lg overflow-hidden">
          <VideoPlayer
            source={post.video_url}
            thumbnail={post.thumbnail_url}
          />
        </div>
        <div className="space-y-3">
          <h1 className="text-xl md:text-2xl font-semibold text-textPrimary">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-textSecondary">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wide">{post.subject}</span>
              <span>·</span>
              <span>{post.views_count} views</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium hover:border-accent transition">
                👍 Like
              </button>
              <button className="px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium hover:border-accent transition">
                💾 Save
              </button>
              <button className="px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium hover:border-accent transition">
                ↗ Share
              </button>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 space-y-2 text-sm">
            <p className="font-semibold text-textPrimary">
              About this lesson
            </p>
            <p className="text-textSecondary whitespace-pre-wrap">
              {post.description}
            </p>
            {!transcriptReady && (
              <p className="text-[11px] text-warning bg-warning/10 inline-flex px-3 py-1 rounded-full mt-2">
                Transcript is still processing; AI answers use the description
                for now.
              </p>
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
  );
}

export default PostDetail;
