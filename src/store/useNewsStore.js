import { create } from "zustand";
import { tmdbAPI } from "../services/api";

const useNewsStore = create((set) => ({
  news: [],
  loading: false,
  fetchNews: async () => {
    set({ loading: true });
    try {
      
    } finally {
      set({ loading: false });
    }
  },
}));

export default useNewsStore;
