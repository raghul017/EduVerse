import { create } from 'zustand';
import api from '../utils/api.js';
import { clearSession, getStoredUser, saveSession } from '../utils/auth.js';

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  loading: false,
  error: null,
  async login (credentials) {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', credentials);
      saveSession(data);
      set({ user: data.user, loading: false });
      return data.user;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },
  async signup (payload) {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/signup', payload);
      saveSession(data);
      set({ user: data.user, loading: false });
      return data.user;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Signup failed', loading: false });
      throw error;
    }
  },
  async fetchMe () {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/auth/me');
      saveSession({ user: data });
      set({ user: data, loading: false });
    } catch (error) {
      clearSession();
      set({ user: null, loading: false });
    }
  },
  logout () {
    clearSession();
    set({ user: null });
  }
}));
