import { create } from "zustand";
import { tmdbAPI } from "../services/api";

const useMovieStore = create((set, get) => ({
  contentType: "movie",
  movies: {
    movie: {
      trending: [],
      now_playing: [],
      top_rated: [],
      popular: [],
      upcoming: [],
    },
    tv: {
      trending: [],
      airing_today: [],
      top_rated: [],
      popular: [],
      on_the_air: [],
    },
  },

  loading: false,
  fetchTrendingMovies: async (contentType) => {
    if (get().movies[contentType].trending.length > 0 || !contentType) return;
    set({ loading: true });
    try {
      let res;
      if (contentType === "movie") {
        res = await tmdbAPI.getTrendingMovie();
      } else if (contentType === "tv") {
        res = await tmdbAPI.getTrendingTVShow();
      }
      if (res.success) {
        set({
          movies: {
            ...get().movies,
            [contentType]: {
              ...get().movies[contentType],
              trending: res.content,
            },
          },
        });
      }
    } finally {
      set({ loading: false });
    }
  },
  fetchMoviesByCategory: async (contentType, category) => {
    if (
      get().movies[contentType][category].length > 0 ||
      !contentType ||
      !category
    )
      return;
    set({ loading: true });
    try {
      let res;
      if (contentType === "movie") {
        res = await tmdbAPI.getMoviesByCategory(category);
      } else if (contentType === "tv") {
        res = await tmdbAPI.getTVShowByCategory(category);
      }
      if (res.success) {
        set({
          movies: {
            ...get().movies,
            [contentType]: {
              ...get().movies[contentType],
              [category]: res.content,
            },
          },
        });
      }
    } finally {
      set({ loading: false });
    }
  },
  setContentType: (type) => set({ contentType: type }),
}));

export default useMovieStore;
