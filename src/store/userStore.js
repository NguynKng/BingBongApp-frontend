// src/store/userStore.js
import { create } from "zustand";
import { userAPI } from "../services/api";

const useUserStore = create((set, get) => ({
  users: {}, // ✅ store multiple user profiles { [userId]: userData }
  suggestions: [],
  error: null,

  // ✅ Fetch a user profile (with caching)
  fetchUserProfile: async (slug, force = false) => {
    if (!slug) return null;

    const { users } = get();
    if (users[slug] && !force) {
      // Already cached
      return users[slug];
    }

    set({ error: null });
    try {
      const response = await userAPI.getUserProfileBySlug(slug);
      if (response.success) {
        const user = response.user;
        set((state) => ({
          users: { ...state.users, [slug]: user },
        }));
        return user;
      } else {
        const message = response.message || "Lỗi không xác định";
        set({ error: message });
        throw new Error(message);
      }
    } catch (err) {
      set({ error: err.message || "Lỗi khi gọi API" });
      throw err;
    }
  },

  updateUserProfileInStore: (slug, updatedData) => {
    set((state) => ({
      users: {
        ...state.users,
        [slug]: {
          ...state.users[slug],
          ...updatedData,
        },
      },
    }));
  },

  // ✅ Fetch user suggestions (with caching)
  fetchSuggestions: async (force = false) => {
    const { suggestions } = get();

    if (suggestions.length > 0 && !force) return;

    try {
      const res = await userAPI.getSuggestions();
      if (res.success) {
        set({ suggestions: res.data });
      } else {
        set({ error: res.message || "Không thể lấy gợi ý người dùng" });
      }
    } catch (err) {
      set({ error: err.message || "Lỗi khi gọi API gợi ý" });
    }
  },

  clearSuggestions: () => set({ suggestions: [] }),
}));

export default useUserStore;
