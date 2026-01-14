import { useState, useEffect } from 'react';
import { Plus, Loader2, MessageSquare, ArrowBigUp, ArrowBigDown, Edit2, Trash2, X, Check, Send } from 'lucide-react';
import api from '../../utils/api.js';
import { useAuthStore } from '../../store/authStore.js';

function CommunityFeed({ communityId }) {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', description: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  useEffect(() => {
    loadPosts();
  }, [communityId]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/communities/${communityId}/posts`);
      setPosts(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.description.trim()) return;
    setCreating(true);
    try {
      await api.post(`/communities/${communityId}/posts`, {
        title: newPost.title.trim(),
        description: newPost.description.trim()
      });
      setNewPost({ title: '', description: '' });
      setShowCreateForm(false);
      await loadPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const handleEditPost = async (postId) => {
    try {
      await api.put(`/communities/posts/${postId}`, {
        title: editForm.title.trim(),
        content: editForm.content.trim()
      });
      setEditingPost(null);
      await loadPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/communities/posts/${postId}`);
      await loadPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleVote = async (postId, isUpvote) => {
    if (!user) return alert('Please log in to vote');
    try {
      await api.post(`/communities/posts/${postId}/like`, { isLike: isUpvote });
      await loadPosts();
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  const toggleComments = async (postId) => {
    if (expandedComments[postId]) {
      setExpandedComments({ ...expandedComments, [postId]: false });
    } else {
      setExpandedComments({ ...expandedComments, [postId]: true });
      await loadComments(postId);
    }
  };

  const loadComments = async (postId) => {
    setLoadingComments({ ...loadingComments, [postId]: true });
    try {
      const { data } = await api.get(`/communities/posts/${postId}/comments`);
      setComments({ ...comments, [postId]: data.data || [] });
    } catch (err) {
      console.error('Load comments error:', err);
    } finally {
      setLoadingComments({ ...loadingComments, [postId]: false });
    }
  };

  const handleAddComment = async (postId) => {
    if (!user) return alert('Please log in to comment');
    if (!newComment[postId]?.trim()) return;
    
    try {
      await api.post(`/communities/posts/${postId}/comments`, {
        content: newComment[postId].trim()
      });
      setNewComment({ ...newComment, [postId]: '' });
      await loadComments(postId);
      await loadPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString();
  };

  if (loading && posts.length === 0) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-[#A1FF62]" /></div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Create Post */}
      {user && !showCreateForm && (
        <button onClick={() => setShowCreateForm(true)} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] hover:border-[#A1FF62]/30 rounded-2xl text-[#666] hover:text-white transition-all">
          <Plus size={20} /> <span className="text-[14px] font-semibold">Create a Post</span>
        </button>
      )}
      
      {showCreateForm && (
        <form onSubmit={handleCreatePost} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">Create Post</h3>
            <button type="button" onClick={() => setShowCreateForm(false)}><X size={20} className="text-[#666]" /></button>
          </div>
          <input type="text" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} placeholder="Title..." className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:border-[#A1FF62] focus:outline-none" />
          <textarea value={newPost.description} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} placeholder="Content..." rows={4} className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white resize-none focus:border-[#A1FF62] focus:outline-none" />
          <button type="submit" disabled={creating} className="w-full py-3 bg-[#A1FF62] text-black rounded-xl font-bold flex items-center justify-center gap-2">
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {creating ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      )}

      {error && <p className="text-red-400 text-center">{error}</p>}

      {!loading && posts.length === 0 && (
        <div className="text-center py-16"><MessageSquare size={48} className="text-[#333] mx-auto mb-3" /><p className="text-[#666]">No posts yet</p></div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => {
          const upvotes = parseInt(post.upvotes) || 0;
          const downvotes = parseInt(post.downvotes) || 0;
          const commentsCount = parseInt(post.comments_count) || 0;
          const isUpvoted = post.user_vote === true;
          const isDownvoted = post.user_vote === false;
          const postComments = comments[post.id] || [];

          return (
            <article key={post.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
              <div className="flex">
                {/* Vote Sidebar */}
                <div className="flex flex-col items-center gap-1 p-3 bg-[#151515] border-r border-[#2a2a2a]">
                  <button onClick={() => handleVote(post.id, true)} className={`p-1 rounded-lg ${isUpvoted ? 'text-[#A1FF62]' : 'text-[#666] hover:text-[#A1FF62]'}`}>
                    <ArrowBigUp size={28} fill={isUpvoted ? '#A1FF62' : 'none'} />
                  </button>
                  <span className={`text-[14px] font-bold ${upvotes > downvotes ? 'text-[#A1FF62]' : upvotes < downvotes ? 'text-red-400' : 'text-[#666]'}`}>
                    {upvotes - downvotes}
                  </span>
                  <button onClick={() => handleVote(post.id, false)} className={`p-1 rounded-lg ${isDownvoted ? 'text-red-400' : 'text-[#666] hover:text-red-400'}`}>
                    <ArrowBigDown size={28} fill={isDownvoted ? '#ef4444' : 'none'} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  {editingPost === post.id ? (
                    <div className="space-y-3">
                      <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-2 text-white" />
                      <textarea value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} rows={3} className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl px-4 py-2 text-white resize-none" />
                      <div className="flex gap-2">
                        <button onClick={() => handleEditPost(post.id)} className="px-4 py-2 bg-[#A1FF62] text-black rounded-lg text-sm font-semibold flex items-center gap-1"><Check size={16} /> Save</button>
                        <button onClick={() => setEditingPost(null)} className="px-4 py-2 bg-[#333] text-white rounded-lg text-sm flex items-center gap-1"><X size={16} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#A1FF62] rounded-full flex items-center justify-center text-black font-bold text-xs">{post.user_name?.charAt(0) || 'U'}</div>
                          <span className="text-white font-medium text-[13px]">{post.user_name}</span>
                          <span className="text-[#555] text-[12px]">• {formatDate(post.created_at)}</span>
                        </div>
                        {user && user.id === post.user_id && (
                          <div className="flex gap-1">
                            <button onClick={() => { setEditingPost(post.id); setEditForm({ title: post.title, content: post.content }); }} className="p-2 text-[#666] hover:text-[#A1FF62]"><Edit2 size={14} /></button>
                            <button onClick={() => handleDeletePost(post.id)} className="p-2 text-[#666] hover:text-red-400"><Trash2 size={14} /></button>
                          </div>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-[17px] mb-2">{post.title}</h3>
                      <p className="text-[#aaa] text-[14px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#2a2a2a]">
                        <span className="text-[#666] text-[13px]">{upvotes} upvotes</span>
                        <span className="text-[#666] text-[13px]">{downvotes} downvotes</span>
                        <button onClick={() => toggleComments(post.id)} className={`flex items-center gap-2 text-[13px] ${expandedComments[post.id] ? 'text-[#A1FF62]' : 'text-[#666] hover:text-white'}`}>
                          <MessageSquare size={16} /> {commentsCount} comments
                        </button>
                      </div>

                      {/* Comments Section */}
                      {expandedComments[post.id] && (
                        <div className="mt-4 pt-4 border-t border-[#2a2a2a] space-y-4">
                          {loadingComments[post.id] ? (
                            <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-[#A1FF62]" /></div>
                          ) : (
                            <>
                              {postComments.length === 0 && <p className="text-[#555] text-[13px] text-center py-2">No comments yet</p>}
                              {postComments.map((c) => (
                                <div key={c.id} className="flex gap-3">
                                  <div className="w-7 h-7 bg-[#333] rounded-full flex items-center justify-center text-[#A1FF62] text-xs font-bold">{c.user_name?.charAt(0) || 'U'}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white text-[13px] font-medium">{c.user_name}</span>
                                      <span className="text-[#555] text-[11px]">{formatDate(c.created_at)}</span>
                                    </div>
                                    <p className="text-[#aaa] text-[13px] mt-1">{c.content}</p>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Add Comment */}
                              {user && (
                                <div className="flex gap-2 mt-3">
                                  <input
                                    type="text"
                                    value={newComment[post.id] || ''}
                                    onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-[13px] focus:border-[#A1FF62] focus:outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                  />
                                  <button onClick={() => handleAddComment(post.id)} className="px-3 py-2 bg-[#A1FF62] text-black rounded-lg"><Send size={16} /></button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default CommunityFeed;
