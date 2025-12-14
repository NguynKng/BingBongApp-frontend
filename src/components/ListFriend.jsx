import { useEffect, useState, useMemo, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SpinnerLoading from "../components/SpinnerLoading";
import { ORIGINAL_IMG_BASE_URL } from "../utils/movie_constants";
import { formatReleaseDate } from "../utils/timeUtils";
import { useGetSuggestion } from "../hooks/useProfile";
import useMovieStore from "../store/movieStore";
import { getBackendImgURL } from "../utils/helper";
import { userAPI } from "../services/api";
import useAuthStore from "../store/authStore";

const ListFriend = memo(() => {
  const { movies, loading, fetchTrendingMovies, contentType } = useMovieStore();
  const { suggestions, loading: suggestionsLoading } = useGetSuggestion();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTrendingMovies(contentType);
  }, [fetchTrendingMovies, contentType]);

  // ✅ Memoize grouped movies
  const groupedMovies = useMemo(() => {
    if (!movies[contentType]?.trending) return [];
    const groups = [];
    for (let i = 0; i < movies[contentType].trending.length; i += 5) {
      groups.push(movies[contentType].trending.slice(i, i + 5));
    }
    return groups;
  }, [movies, contentType]);

  // ✅ Memoize random suggestions
  const randomSuggestions = useMemo(() => {
    if (!suggestions) return [];
    return suggestions.slice(0, 5);
  }, [suggestions]);

  // Auto slide
  useEffect(() => {
    if (!groupedMovies.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 >= groupedMovies.length ? 0 : prev + 1
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [groupedMovies.length]);

  return (
    <div className="w-full space-y-4">
      {/* Friend Suggestions */}
      <div className="shadow-lg rounded-lg w-full p-4 bg-white dark:bg-[#1b1f2b] border border-gray-100 dark:border-gray-700 transition-all">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-800 dark:text-gray-100">
            Suggestions for you
          </h1>
          <Link
            to="/friends"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            See all
          </Link>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          {suggestionsLoading ? (
            <SpinnerLoading />
          ) : (
            randomSuggestions.map((user) => (
              <SuggestionCard key={user._id} user={user} />
            ))
          )}
        </div>
      </div>

      {/* Trending Movies 🔥 */}
      <div className="shadow-lg rounded-lg w-full p-4 bg-white dark:bg-[#1b1f2b] border border-gray-100 dark:border-gray-700 transition-all">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            Trending Movies
          </h1>
          <Link
            to="/movie"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            View more
          </Link>
        </div>

        <div className="mt-2">
          {loading ? (
            <SpinnerLoading />
          ) : (
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: "0%", opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700 w-full"
                >
                  {groupedMovies[currentIndex]?.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ListFriend.displayName = "ListFriend";

// ✅ Extract SuggestionCard with memo
const SuggestionCard = memo(({ user }) => {
  const { user: currentUser } = useAuthStore();
  const [isRequestSent, setIsRequestSent] = useState(
    user.friendRequests.includes(currentUser._id)
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFriendRequest = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isRequestSent) {
        // Cancel friend request
        await userAPI.cancelFriendRequest(user._id);
        setIsRequestSent(false);
      } else {
        // Send friend request
        await userAPI.sendFriendRequest(user._id);
        setIsRequestSent(true);
      }
    } catch (error) {
      console.error("Error toggling friend request:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user._id, isRequestSent]);

  return (
    <div className="flex items-center gap-4 py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a3142] transition-all">
      <Link to={`/profile/${user.slug}`}>
        <img
          src={getBackendImgURL(user.avatar)}
          alt={user.fullName}
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          loading="lazy"
        />
      </Link>

      <div className="flex-1">
        <Link
          to={`/profile/${user.slug}`}
          className="font-semibold block text-gray-800 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
        >
          {user.fullName}
        </Link>
        <span className="text-sm text-gray-500 dark:text-gray-400 block">
          Suggested for you
        </span>
      </div>

      <button
        onClick={handleToggleFriendRequest}
        disabled={isLoading}
        className={`ml-auto px-3 cursor-pointer py-1 text-sm rounded-lg transition-all ${
          isRequestSent
            ? "bg-gray-500 hover:bg-gray-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? "..." : isRequestSent ? "Cancel" : "Add"}
      </button>
    </div>
  );
});

SuggestionCard.displayName = "SuggestionCard";

// ✅ Extract MovieCard with memo
const MovieCard = memo(({ movie, index }) => {
  // ✅ Memoize image URL
  const imageUrl = useMemo(
    () => `${ORIGINAL_IMG_BASE_URL}${movie.backdrop_path}`,
    [movie.backdrop_path]
  );

  // ✅ Memoize release date
  const releaseDate = useMemo(
    () => formatReleaseDate(movie.release_date),
    [movie.release_date]
  );

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="flex items-center gap-4 py-3 px-2 hover:bg-gray-50 dark:hover:bg-[#2a3142] rounded-lg transition-all group"
    >
      <span className="text-lg font-bold text-gray-500 dark:text-gray-400 w-6">
        {index + 1}
      </span>
      <img
        src={imageUrl}
        alt={movie.title || movie.name}
        className="w-20 h-14 rounded-lg object-cover shadow-sm group-hover:shadow-md group-hover:shadow-blue-500/20 transition-all"
        loading="lazy"
      />
      <div className="flex-1">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-blue-500 dark:group-hover:text-blue-400">
          {movie.name || movie.title}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Release: {releaseDate}
        </p>
      </div>
    </Link>
  );
});

MovieCard.displayName = "MovieCard";

export default ListFriend;
