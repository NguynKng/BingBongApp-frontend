import { useEffect, useMemo, useState, useCallback } from "react";
import useMovieStore from "../store/movieStore";
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from "../utils/movie_constants";
import { formatReleaseDate } from "../utils/timeUtils";
import { CircleAlert, Play } from "lucide-react";
import { Link } from "react-router-dom";
import WatchPageSkeleton from "../components/WatchPageSkeleton";
import MovieSlider from "../components/MovieSlider";

export default function MoviePage() {
  const { movies, fetchTrendingMovies, contentType, setContentType, loading } =
    useMovieStore();
  const [imgLoading, setImgLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Memoize current movie
  const currentMovie = useMemo(
    () =>
      movies[contentType]?.trending?.[currentIndex] || null,
    [movies, currentIndex, contentType]
  );

  // ✅ Memoize categories to render
  const categoriesToRender = useMemo(
    () => (contentType === "movie" ? MOVIE_CATEGORIES : TV_CATEGORIES),
    [contentType]
  );

  // ✅ Memoize release date
  const releaseDate = useMemo(
    () =>
      currentMovie
        ? formatReleaseDate(currentMovie.release_date || currentMovie.first_air_date)
        : "",
    [currentMovie]
  );

  // ✅ Memoize overview text
  const overviewText = useMemo(() => {
    if (!currentMovie?.overview) return "";
    return currentMovie.overview.length > 200
      ? currentMovie.overview.slice(0, 200) + "..."
      : currentMovie.overview;
  }, [currentMovie]);

  // ✅ Memoize backdrop image URL
  const backdropUrl = useMemo(
    () => currentMovie ? ORIGINAL_IMG_BASE_URL + currentMovie.backdrop_path : "",
    [currentMovie]
  );

  // ✅ useCallback for handlers
  const handleImageLoad = useCallback(() => {
    setImgLoading(false);
  }, []);

  const handleContentTypeChange = useCallback((type) => {
    setContentType(type);
  }, [setContentType]);

  useEffect(() => {
    fetchTrendingMovies(contentType);
  }, [fetchTrendingMovies, contentType]);

  // ✅ Auto-slider effect
  useEffect(() => {
    if (!movies[contentType]?.trending) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        (prev + 1) % movies[contentType].trending.length
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [movies, contentType]);

  if (loading || !movies[contentType]?.trending) {
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[92vh] text-white">
        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
        )}

        {/* Navigation */}
        <nav className="absolute top-0 left-1/2 -translate-x-1/2 max-w-6xl flex flex-wrap items-center justify-between p-4 h-20 z-20 gap-2">
          <div className="flex items-center gap-2 sm:gap-10">
            <div className="hidden sm:flex gap-5 items-center">
              <Link
                to="/movie"
                className="hover:underline hover:underline-offset-4"
                onClick={() => handleContentTypeChange("movie")}
              >
                Home
              </Link>
              <Link
                to="/movie"
                className="hover:underline hover:underline-offset-4"
                onClick={() => handleContentTypeChange("tv")}
              >
                TV Shows
              </Link>
              <Link
                to="/movie"
                className="hover:underline hover:underline-offset-4"
                onClick={() => handleContentTypeChange("movie")}
              >
                Movies
              </Link>
            </div>
          </div>
        </nav>

        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={backdropUrl}
            className="absolute top-0 left-0 object-cover w-full h-full z-10"
            alt="Movie Image"
            loading="lazy"
            onLoad={handleImageLoad}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-black/20 z-11" />
        </div>

        {/* Movie Info */}
        <div className="absolute flex items-center z-20 justify-center top-1/2 -translate-y-1/2 sm:justify-normal left-20 p-4">
          <div className="max-w-xl p-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white">
              {currentMovie?.name || currentMovie?.title}
            </h1>

            <p className="mt-2 text-lg">
              {releaseDate} |{" "}
              {currentMovie?.adult ? (
                <span className="text-red-500">18+</span>
              ) : (
                <span className="text-green-500">PG-13</span>
              )}
            </p>

            <p className="mt-4 sm:text-xl text-lg">{overviewText}</p>

            <div className="mt-8 flex gap-4">
              <Link
                to={`/movie/${currentMovie?.id}`}
                className="flex bg-white items-center rounded-lg hover:bg-white/80 text-black font-bold py-2 px-4 gap-2"
              >
                <Play className="fill-black" />
                Play
              </Link>
              <Link
                to={`/movie/${currentMovie?.id}`}
                className="flex bg-gray-600 items-center rounded-lg hover:bg-gray-800 text-white py-2 px-4 gap-2"
              >
                <CircleAlert />
                More info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Sliders */}
      <div className="flex flex-col gap-10 py-10 text-white">
        {categoriesToRender.map((category) => (
          <MovieSlider key={category} category={category} />
        ))}
      </div>
    </>
  );
}