import { create } from "zustand";
import { tmdbAPI } from "../services/api";

const useMovieStore = create((set, get) => ({
    movies: [],
    loading: false,
    fetchMovies: async () => {
    if (get().movies.length > 0) return; // tránh fetch lại
    set({ loading: true });
    try {
      const res = await tmdbAPI.getTrendingMovie();
      if (res.success) {
        set({ movies: res.content });
      }
    } finally {
      set({ loading: false });
    }
  },

}));

export default useMovieStore;