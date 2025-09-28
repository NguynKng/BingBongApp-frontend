import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SpinnerLoading from "../components/SpinnerLoading";
import { ORIGINAL_IMG_BASE_URL } from "../utils/movie_constants";
import { formatReleaseDate } from "../utils/timeUtils";
import { useGetSuggestion } from "../hooks/useProfile";
import Config from "../envVars";
import useMovieStore from "../store/movieStore";

function ListFriend() {
  const { movies, fetchMovies, loading } = useMovieStore();
  const { suggestions, loading: suggestionsLoading } = useGetSuggestion();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Chia phim thành từng nhóm 5, và ghi nhớ bằng useMemo
  const groupedMovies = useMemo(() => {
    if (!movies) return [];
    const groups = [];
    for (let i = 0; i < movies.length; i += 5) {
      groups.push(movies.slice(i, i + 5));
    }
    return groups;
  }, [movies]);

  const randomSuggestions = useMemo(() => {
    if (!suggestions) return [];
    const shuffled = [...suggestions].sort(() => Math.random() - 0.5); // shuffle
    return shuffled.slice(0, 5);
  }, [suggestions]);

  // Cứ 10s đổi nhóm phim
  useEffect(() => {
    if (!groupedMovies.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 >= groupedMovies.length ? 0 : prev + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [groupedMovies]);

  return (
    <div className="fixed w-92 min-h-[88vh] rounded-lg max-h-[88vh] overflow-y-auto flex flex-col gap-4 custom-scroll">
      <div className="shadow-lg rounded-lg w-full p-4 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg">Đề xuất cho bạn</h1>
          <Link to="/friends" className="text-blue-500">
            Xem tất cả <span className="ml-1">{`->`}</span>
          </Link>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {suggestionsLoading ? (
            <SpinnerLoading />
          ) : (
            randomSuggestions.map((user) => (
              <div className="flex items-center gap-4">
                <Link to={`/profile/${user._id}`}>
                  <img
                    src={`${Config.BACKEND_URL}${user.avatar}`}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Link>

                <div>
                  <Link
                    to={`/profile/${user._id}`}
                    className="font-semibold block"
                  >
                    {user.fullName}
                  </Link>
                  <span className="text-sm text-gray-500 block">
                    Đề xuất cho bạn
                  </span>
                </div>

                <button className="ml-auto px-3 cursor-pointer py-1 bg-blue-400 text-white text-sm rounded-lg hover:bg-blue-500">
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="shadow-lg rounded-lg w-full p-4 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-lg">Phim Hot 🔥</h1>
          <Link to="#" className="text-blue-500">
            Xem thêm <span className="ml-1">{`->`}</span>
          </Link>
        </div>

        {loading ? (
          <SpinnerLoading />
        ) : (
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex} // trigger animation khi đổi nhóm
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col divide-y divide-gray-100 w-full"
              >
                {groupedMovies[currentIndex]?.map((movie, index) => (
                  <div
                    key={movie.id}
                    className="flex items-center gap-4 py-3 hover:bg-gray-50 rounded-lg px-2 transition"
                  >
                    <span className="text-lg font-bold text-gray-500 w-6">
                      {index + 1}
                    </span>
                    <img
                      src={`${ORIGINAL_IMG_BASE_URL}${movie.backdrop_path}`}
                      alt={movie.title}
                      className="w-20 h-14 rounded-lg object-cover shadow-sm"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h2 className="text-base font-semibold line-clamp-1">
                        {movie?.name || movie?.title}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {`Release: ${formatReleaseDate(movie.release_date)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListFriend;
