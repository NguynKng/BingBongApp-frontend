import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { gameAPI } from "../services/api";
import { Search, Star, ChevronLeft, Gamepad2, X, Clock } from "lucide-react";

function SearchResultCard({ game }) {
  const rating = game.rating?.toFixed(1) || "N/A";
  const year = game.released ? new Date(game.released).getFullYear() : "";
  return (
    <Link
      to={`/games/${game.id}`}
      className="group flex gap-4 p-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-transparent hover:border-violet-200 dark:hover:border-violet-700 transition-all"
    >
      <div className="flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={game.background_image || "https://placehold.co/80x48/1a1a2e/7c3aed?text=?"}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {game.name}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">{rating}</span>
          </div>
          {year && <span className="text-xs text-gray-400 dark:text-gray-500">{year}</span>}
          {game.genres?.slice(0, 2).map((g) => (
            <span key={g.id} className="text-xs text-violet-500 dark:text-violet-400">{g.name}</span>
          ))}
        </div>
      </div>
      {game.metacritic && (
        <div className={`flex-shrink-0 self-start px-2 py-0.5 rounded text-xs font-bold ${
          game.metacritic >= 75 ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" :
          game.metacritic >= 50 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400" :
          "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
        }`}>
          {game.metacritic}
        </div>
      )}
    </Link>
  );
}

const RECENT_KEY = "game_search_recent";
function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
}
function saveRecent(query) {
  const list = [query, ...getRecent().filter((q) => q !== query)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

export default function GameSearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [recent, setRecent] = useState(getRecent());
  const inputRef = useRef(null);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  // Search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setTotalCount(0);
      setPage(1);
      return;
    }
    const run = async () => {
      setLoading(true);
      setPage(1);
      try {
        const res = await gameAPI.searchGames(debouncedQuery, 1);
        if (res.success) {
          setResults(res.content.results || []);
          setTotalCount(res.content.count || 0);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [debouncedQuery]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const res = await gameAPI.searchGames(debouncedQuery, nextPage);
      if (res.success) {
        setResults((prev) => [...prev, ...(res.content.results || [])]);
        setPage(nextPage);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) saveRecent(query.trim());
  };

  const handleRecentClick = (q) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  const hasMore = results.length < totalCount;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d1a] text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#0d0d1a]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <Link
              to="/games"
              id="back-from-search"
              className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <ChevronLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <Gamepad2 size={20} className="text-violet-500" />
              <span className="font-bold text-gray-900 dark:text-white">Search Games</span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
            <input
              ref={inputRef}
              id="game-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for games…"
              autoFocus
              className="w-full pl-11 pr-10 py-3.5 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-violet-400 dark:focus:border-violet-500 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
            />
            {query && (
              <button
                type="button"
                id="clear-search"
                onClick={() => { setQuery(""); setResults([]); setTotalCount(0); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Empty state – show recent & suggestions */}
        {!query.trim() && (
          <div className="space-y-6">
            {recent.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Clock size={14} className="text-violet-400" />
                    Recent Searches
                  </div>
                  <button
                    id="clear-recent"
                    onClick={clearRecent}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleRecentClick(q)}
                      className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:border-violet-400 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center py-16">
              <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 size={36} className="text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Find Your Next Game</h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Search from thousands of games across all platforms
              </p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && results.length === 0 && query.trim() && (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-3 animate-pulse">
                <div className="w-20 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-violet-600 dark:text-violet-400">{totalCount.toLocaleString()}</span> results for &quot;{debouncedQuery}&quot;
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700/50 shadow-sm">
              {results.map((game) => (
                <SearchResultCard key={game.id} game={game} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  id="load-more-search"
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-violet-500/20 cursor-pointer flex items-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More (${results.length} / ${totalCount})`
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* No results */}
        {!loading && debouncedQuery.trim() && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400 mb-2">No games found</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Try different keywords or check the spelling
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
