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
        transcript_ready: Boolean(post.transcript && post.transcript.length > 20)
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
    try {
      const posts = get().posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes_count: post.likes_count + (post.liked ? -1 : 1)
            }
          : post
      );
      set({ posts });
      const post = get().posts.find((p) => p.id === postId);
      if (post?.liked) {
        await api.post(`/posts/${postId}/like`);
      } else {
        await api.delete(`/posts/${postId}/like`);
      }
    } catch {
      set({ error: 'Failed to update like' });
    }
  },
  async toggleBookmark (postId) {
    try {
      const posts = get().posts.map((post) =>
        post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
      );
      set({ posts });
      const post = get().posts.find((p) => p.id === postId);
      if (post?.bookmarked) {
        await api.post(`/posts/${postId}/bookmark`);
      } else {
        await api.delete(`/posts/${postId}/bookmark`);
      }
    } catch {
      set({ error: 'Failed to update bookmark' });
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

