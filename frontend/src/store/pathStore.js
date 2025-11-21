import { create } from "zustand";
import api from "../utils/api.js";

export const usePathStore = create((set, get) => ({
  paths: [],
  loading: false,
  error: null,
  async fetchPaths() {
    if (get().loading || get().paths.length) return;
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/paths");
      set({ paths: data.data || [], loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to load learning paths.",
      });
    }
  },
}));
