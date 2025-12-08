import { useState, memo, useMemo } from "react";
import { Search, Film, Tv, User } from "lucide-react";
import toast from "react-hot-toast";
import { ORIGINAL_IMG_BASE_URL } from "../utils/movie_constants";
import { Link } from "react-router-dom";
import { tmdbAPI } from "../services/api";
import useMovieStore from "../store/movieStore";

const MovieSearchPage = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setContentType } = useMovieStore();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    tab === "movie" ? setContentType("movie") : setContentType("tv");
    setSearchTerm("");
    setResults([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await tmdbAPI.getSearchContent(activeTab, searchTerm);
      setResults(response.data);
      console.log(response.data);
      if (response.data.length === 0) {
        toast.error("No results found");
      }
    } catch {
      toast.error("Failed to fetch search results.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const tabs = [
    { id: "movie", label: "Movies", icon: Film },
    { id: "tv", label: "TV Shows", icon: Tv },
    { id: "person", label: "Person", icon: User },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Your Next Favorite
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search through millions of movies, TV shows, and people
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center cursor-pointer gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-white dark:bg-[#1b1f2b] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a3142] border border-gray-200 dark:border-gray-700"
                }`}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search for ${
                activeTab === "tv"
                  ? "TV shows"
                  : activeTab === "person"
                  ? "people"
                  : "movies"
              }...`}
              className="w-full px-6 py-4 pr-14 rounded-2xl bg-white dark:bg-[#1b1f2b] text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all shadow-lg"
              autoFocus
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={20} className="cursor-pointer" />
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Found {results.length} results
            </h2>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {results.map((result) => {
            if (result.poster_path === null && result.profile_path === null)
              return null;

            return (
              <ResultCard
                key={result.id}
                result={result}
                activeTab={activeTab}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {results.length === 0 && searchTerm && !isSearching && (
          <div className="text-center py-20">
            <div className="mb-4 text-6xl">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try searching with different keywords
            </p>
          </div>
        )}

        {/* Initial State */}
        {results.length === 0 && !searchTerm && (
          <div className="text-center py-20">
            <div className="mb-4 text-6xl">🎬</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start Your Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a keyword to discover amazing content
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Memoized Result Card Component
const ResultCard = memo(({ result, activeTab }) => {
  // ✅ Memoize image URL
  const imageUrl = useMemo(() => {
    return result.poster_path || result.profile_path
      ? `${ORIGINAL_IMG_BASE_URL}${result.poster_path || result.profile_path}`
      : "/none-image.jfif";
  }, [result.poster_path, result.profile_path]);

  // ✅ Memoize release year
  const releaseYear = useMemo(() => {
    return (
      result?.release_date?.split("-")[0] ||
      result?.first_air_date?.split("-")[0] ||
      "N/A"
    );
  }, [result.release_date, result.first_air_date]);

  // ✅ Memoize vote average
  const voteAverage = useMemo(() => {
    return result?.vote_average > 0 ? result.vote_average.toFixed(1) : null;
  }, [result.vote_average]);

  return (
    <Link
      to={activeTab === "person" ? "#" : `/movie/${result.id}`}
      className="group"
    >
      <div className="bg-white dark:bg-[#1b1f2b] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:scale-105 hover:border-blue-500 dark:hover:border-blue-500 h-full flex flex-col">
        {/* Image - Fixed Height */}
        <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gray-200 dark:bg-gray-800">
          <img
            src={imageUrl}
            alt={result?.title || result?.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content - Fixed Height */}
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
            {result?.title || result?.name}
          </h3>

          <div className="mt-auto space-y-1">
            {activeTab !== "person" && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {releaseYear}
              </p>
            )}
            {voteAverage && activeTab !== "person" && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {voteAverage}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

ResultCard.displayName = "ResultCard";

export default MovieSearchPage;