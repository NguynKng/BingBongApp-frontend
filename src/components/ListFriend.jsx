import { Ellipsis, Search } from "lucide-react";
import { useGetProfile } from "../hooks/useProfile";
import useAuthStore from "../store/authStore";
import SpinnerLoading from "../components/SpinnerLoading";
import { useEffect, useMemo, useState } from "react";
import Config from "../envVars";
import { Link } from "react-router-dom";
import { useGetTrendingMovie } from "../hooks/useTMDB";
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from "../utils/movie_constants";
import { formatReleaseDate } from "../utils/timeUtils";

function ListFriend() {
  const { movies, loading } = useGetTrendingMovie();

  console.log(movies);

  return (
    <div className="fixed w-92 min-h-[92vh] max-h-[92vh]">
      <div className="shadow-lg rounded-lg w-full p-4 bg-white">
        <h1 className="text-xl font-bold mb-4 border-b pb-2">
          Phim Trending
        </h1>

        {loading ? (
          <SpinnerLoading />
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {movies?.map((movie, index) => (
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
                />
                <div className="flex-1">
                  <h2 className="text-base font-semibold line-clamp-1">
                    {movie?.name || movie?.title}
                  </h2>
                  <p className="text-xs text-gray-500">{`Release: ${formatReleaseDate(movie.release_date)}`}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListFriend;
