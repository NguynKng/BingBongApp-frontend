import { create } from "zustand";
import { tmdbAPI } from "../services/api";

const useMovieStore = create((set) => ({
  contentType: "movie",
  movies: [],
  loading: false,
  fetchMovies: async (contentType) => {
    set({ loading: true });
    try {
      let res;
      if (contentType === "movie") {
        res = await tmdbAPI.getTrendingMovie();
      } else if (contentType === "tv") {
        res = await tmdbAPI.getTrendingTVShow();
      }
      if (res.success) {
        set({ movies: res.content });
      }
    } finally {
      set({ loading: false });
    }
  },
  setContentType: (type) => set({ contentType: type }),
}));

export default useMovieStore;
