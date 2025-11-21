import { create } from 'zustand';
import api from '../utils/api.js';

export const usePostStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  async fetchFeed (reset = false) {
    const page = reset ? 1 : get().page;
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/posts', { params: { page } });
      const normalized = data.data.map((post) => ({
        ...post,
        transcript_ready: Boolean(post.transcript && post.transcript.length > 20),
        liked: post.liked || false,
        bookmarked: post.bookmarked || false,
        likes_count: post.likes_count || 0,
        bookmarks_count: post.bookmarks_count || 0
      }));
      const nextPosts = reset ? normalized : [...get().posts, ...normalized];
      set({
        posts: nextPosts,
        loading: false,
        hasMore: data.data.length > 0,
        page: page + 1
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to load feed'
      });
    }
  },
  async toggleLike (postId) {
    const currentPost = get().posts.find((p) => p.id === postId);
    const wasLiked = currentPost?.liked || false;
    
    // Optimistic update
    const posts = get().posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            likes_count: Math.max(0, post.likes_count + (post.liked ? -1 : 1))
          }
        : post
    );
    set({ posts });
    
    try {
      if (wasLiked) {
        await api.delete(`/posts/${postId}/like`);
      } else {
        await api.post(`/posts/${postId}/like`);
      }
    } catch (error) {
      // Revert on error
      set({ posts: get().posts.map((post) =>
        post.id === postId ? currentPost : post
      )});
      throw error;
    }
  },
  async toggleBookmark (postId) {
    const currentPost = get().posts.find((p) => p.id === postId);
    const wasBookmarked = currentPost?.bookmarked || false;
    
    // Optimistic update
    const posts = get().posts.map((post) =>
      post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
    );
    set({ posts });
    
    try {
      if (wasBookmarked) {
        await api.delete(`/posts/${postId}/bookmark`);
      } else {
        await api.post(`/posts/${postId}/bookmark`);
      }
    } catch (error) {
      // Revert on error
      set({ posts: get().posts.map((post) =>
        post.id === postId ? currentPost : post
      )});
      throw error;
    }
  },
  async deletePost (postId) {
    try {
      await api.delete(`/posts/${postId}`);
      set({ posts: get().posts.filter((post) => post.id !== postId) });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete post'
      });
      throw error;
    }
  }
}));

