// src/store/userStore.js
import { create } from "zustand";
import { userAPI } from "../services/api";

const useUserStore = create((set, get) => ({
  users: {}, // ✅ store multiple user profiles { [userId]: userData }
  suggestions: [],
  loading: false,
  error: null,

  // ✅ Fetch a user profile (with caching)
  fetchUserProfile: async (userId, force = false) => {
    if (!userId) return null;

    const { users } = get();
    if (users[userId] && !force) {
      // Already cached
      return users[userId];
    }

    set({ loading: true, error: null });
    try {
      const response = await userAPI.getUserProfile(userId);
      if (response.success) {
        const user = response.user;
        set((state) => ({
          users: { ...state.users, [userId]: user },
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
    } finally {
      set({ loading: false });
    }
  },

  updateUserProfileInStore: (userId, updatedData) => {
    set((state) => ({
      users: {
        ...state.users,
        [userId]: {
          ...state.users[userId],
          ...updatedData,
        },
      },
    }));
  },

  // ✅ Fetch user suggestions (with caching)
  fetchSuggestions: async (force = false) => {
    const { suggestions, loading } = get();

    if (suggestions.length > 0 && !force) return;
    if (loading) return;

    set({ loading: true, error: null });
    try {
      const res = await userAPI.getSuggestions();
      if (res.success) {
        set({ suggestions: res.data });
      } else {
        set({ error: res.message || "Không thể lấy gợi ý người dùng" });
      }
    } catch (err) {
      set({ error: err.message || "Lỗi khi gọi API gợi ý" });
    } finally {
      set({ loading: false });
    }
  },

  clearSuggestions: () => set({ suggestions: [] }),
}));

export default useUserStore;
