import { create } from 'zustand';
import api from '../utils/api.js';

export const useCommunityStore = create((set, get) => ({
  communities: [],
  loading: false,
  error: null,
  async fetchCommunities () {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/communities');
      set({ communities: data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to load communities',
        loading: false
      });
    }
  },
  async toggleMembership (communityId, joined) {
    try {
      if (joined) {
        await api.delete(`/communities/${communityId}/leave`);
      } else {
        await api.post(`/communities/${communityId}/join`);
      }
      const updated = get().communities.map((community) =>
        community.id === communityId
          ? {
              ...community,
              joined: !joined,
              member_count: Math.max(0, (community.member_count || 0) + (joined ? -1 : 1))
            }
          : community
      );
      set({ communities: updated });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update membership';
      set({ error: errorMsg });
      throw error;
    }
  },
  async createCommunity (payload) {
    try {
      const { data } = await api.post('/communities', payload);
      set({ communities: [data.data, ...get().communities] });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create community'
      });
      throw error;
    }
  }
}));
