import { create } from "zustand";
import { gameAPI } from "../services/api";

const useGameStore = create((set, get) => ({
  // State
  trending: [],
  upcoming: [],
  popular: [],      // highest rated (metacritic)
  bestRated: [],    // highest rating by players
  genres: [],
  games: [],
  totalCount: 0,
  currentPage: 1,
  selectedGenre: null,
  ordering: "-rating",
  loading: false,
  sectionLoading: {
    trending: false,
    upcoming: false,
    popular: false,
    bestRated: false,
    genres: false,
    games: false,
  },

  // ── Trending (most recently added) ──
  fetchTrendingGames: async () => {
    if (get().trending.length > 0) return;
    set((s) => ({ sectionLoading: { ...s.sectionLoading, trending: true } }));
    try {
      const res = await gameAPI.getTrendingGames();
      if (res.success) set({ trending: res.content });
    } catch (e) {
      console.error("fetchTrendingGames:", e);
    } finally {
      set((s) => ({ sectionLoading: { ...s.sectionLoading, trending: false } }));
    }
  },

  // ── Upcoming ──
  fetchUpcomingGames: async () => {
    if (get().upcoming.length > 0) return;
    set((s) => ({ sectionLoading: { ...s.sectionLoading, upcoming: true } }));
    try {
      const res = await gameAPI.getUpcomingGames(1, 15);
      if (res.success) set({ upcoming: res.content.results || [] });
    } catch (e) {
      console.error("fetchUpcomingGames:", e);
    } finally {
      set((s) => ({ sectionLoading: { ...s.sectionLoading, upcoming: false } }));
    }
  },

  // ── Popular (most played / added) ──
  fetchPopularGames: async () => {
    if (get().popular.length > 0) return;
    set((s) => ({ sectionLoading: { ...s.sectionLoading, popular: true } }));
    try {
      const res = await gameAPI.getGames({ ordering: "-added", page_size: 12 });
      if (res.success) set({ popular: res.content.results || [] });
    } catch (e) {
      console.error("fetchPopularGames:", e);
    } finally {
      set((s) => ({ sectionLoading: { ...s.sectionLoading, popular: false } }));
    }
  },

  // ── Best Rated (metacritic) ──
  fetchBestRatedGames: async () => {
    if (get().bestRated.length > 0) return;
    set((s) => ({ sectionLoading: { ...s.sectionLoading, bestRated: true } }));
    try {
      const res = await gameAPI.getGames({ ordering: "-metacritic", page_size: 12 });
      if (res.success) set({ bestRated: res.content.results || [] });
    } catch (e) {
      console.error("fetchBestRatedGames:", e);
    } finally {
      set((s) => ({ sectionLoading: { ...s.sectionLoading, bestRated: false } }));
    }
  },

  // ── Genres ──
  fetchGenres: async () => {
    if (get().genres.length > 0) return;
    set((s) => ({ sectionLoading: { ...s.sectionLoading, genres: true } }));
    try {
      const res = await gameAPI.getGenres();
      if (res.success) set({ genres: res.content });
    } catch (e) {
      console.error("fetchGenres:", e);
    } finally {
      set((s) => ({ sectionLoading: { ...s.sectionLoading, genres: false } }));
    }
  },

  // ── Browse / filtered list ──
  setFilter: (updates) => set((state) => ({ ...state, ...updates })),

  fetchGames: async (params = {}, append = false) => {
    set((s) => ({ sectionLoading: { ...s.sectionLoading, games: true } }));
    try {
      const res = await gameAPI.getGames(params);
      if (res.success) {
        set((state) => ({
          games: append
            ? [...state.games, ...res.content.results]
            : res.content.results,
          totalCount: res.content.count,
          currentPage: params.page || 1,
        }));
      }
    } catch (e) {
      console.error("fetchGames:", e);
    } finally {
      set((s) => ({ sectionLoading: { ...s.sectionLoading, games: false } }));
    }
  },

  clearGames: () => set({ games: [], totalCount: 0, currentPage: 1 }),
}));

export default useGameStore;
