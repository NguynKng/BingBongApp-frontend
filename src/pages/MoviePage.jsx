import { useEffect, useMemo, useState, useCallback } from "react";
import useMovieStore from "../store/movieStore";
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from "../utils/movie_constants";
import { formatReleaseDate } from "../utils/timeUtils";
import {
  CircleAlert,
  Play,
  Star,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
    () => movies[contentType]?.trending?.[currentIndex] || null,
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
        ? formatReleaseDate(
            currentMovie.release_date || currentMovie.first_air_date
          )
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
    () =>
      currentMovie ? ORIGINAL_IMG_BASE_URL + currentMovie.backdrop_path : "",
    [currentMovie]
  );

  // ✅ Memoize vote average
  const voteAverage = useMemo(
    () => currentMovie?.vote_average?.toFixed(1) || "N/A",
    [currentMovie]
  );

  // ✅ useCallback for handlers
  const handleImageLoad = useCallback(() => {
    setImgLoading(false);
  }, []);

  const handleContentTypeChange = useCallback(
    (type) => {
      setContentType(type);
      setCurrentIndex(0);
    },
    [setContentType]
  );

  const handlePrevSlide = useCallback(() => {
    if (!movies[contentType]?.trending) return;
    setCurrentIndex((prev) =>
      prev === 0 ? movies[contentType].trending.length - 1 : prev - 1
    );
  }, [movies, contentType]);

  const handleNextSlide = useCallback(() => {
    if (!movies[contentType]?.trending) return;
    setCurrentIndex((prev) =>
      prev === movies[contentType].trending.length - 1 ? 0 : prev + 1
    );
  }, [movies, contentType]);

  useEffect(() => {
    fetchTrendingMovies(contentType);
  }, [fetchTrendingMovies, contentType]);

  // ✅ Auto-slider effect
  useEffect(() => {
    if (!movies[contentType]?.trending) return;
    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % movies[contentType].trending.length
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [movies, contentType]);

  if (loading || !movies[contentType]?.trending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[92vh] text-gray-900 dark:text-white overflow-hidden bg-gray-100">
        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-300/70 dark:bg-black/70 flex items-center justify-center -z-10 shimmer" />
        )}

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-white/90 dark:from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto flex items-center justify-between p-6">
            <div className="flex items-center gap-8">
              <div className="hidden md:flex gap-6 items-center">
                <button
                  onClick={() => handleContentTypeChange("movie")}
                  className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-all ${
                    contentType === "movie"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10"
                  }`}
                >
                  Movies
                </button>
                <button
                  onClick={() => handleContentTypeChange("tv")}
                  className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-all ${
                    contentType === "tv"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10"
                  }`}
                >
                  TV Shows
                </button>
                <Link
                  to="/movie/search"
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                >
                  Search
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Background Image with Enhanced Gradient */}
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={backdropUrl}
            className="absolute top-0 left-0 object-cover w-full h-full"
            alt="Movie Background"
            loading="lazy"
            onLoad={handleImageLoad}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-white/30 dark:from-black dark:via-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white dark:from-black to-transparent" />
        </div>

        {/* Movie Info - Redesigned */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl space-y-6">
              {/* Badge */}
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-red-600 rounded-full text-sm font-bold uppercase tracking-wider text-white">
                  Trending Now
                </span>
                <span className="px-4 py-1.5 bg-yellow-500/20 border border-yellow-500 rounded-full text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  #{currentIndex + 1} Today
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight">
                {currentMovie?.name || currentMovie?.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Calendar
                    size={16}
                    className="text-gray-700 dark:text-white"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {releaseDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-gray-900 dark:text-white">
                    {voteAverage}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  {currentMovie?.adult ? (
                    <span className="text-red-600 dark:text-red-400 font-bold">
                      18+
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      PG-13
                    </span>
                  )}
                </div>
              </div>

              {/* Overview */}
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                {overviewText}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to={`/movie/${currentMovie?.id}`}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <Play className="fill-white dark:fill-black" size={20} />
                  <span>Watch Now</span>
                </Link>
                <Link
                  to={`/movie/${currentMovie?.id}`}
                  className="flex items-center gap-2 bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-white/20 border border-gray-300 dark:border-white/30 text-gray-900 dark:text-white font-semibold py-3 px-8 rounded-xl transition-all"
                >
                  <CircleAlert size={20} />
                  <span>More Info</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 cursor-pointer top-1/2 -translate-y-1/2 z-30 bg-gray-200/50 dark:bg-black/50 hover:bg-gray-300/70 dark:hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all group"
        >
          <ChevronLeft
            className="text-gray-900 dark:text-white group-hover:scale-110 transition-transform"
            size={24}
          />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 z-30 bg-gray-200/50 dark:bg-black/50 hover:bg-gray-300/70 dark:hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all group"
        >
          <ChevronRight
            className="text-gray-900 dark:text-white group-hover:scale-110 transition-transform"
            size={24}
          />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {movies[contentType]?.trending?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                index === currentIndex
                  ? "w-8 bg-gray-900 dark:bg-white"
                  : "w-1.5 bg-gray-500 dark:bg-white/40 hover:bg-gray-700 dark:hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Movie Sliders */}
      <div className="flex flex-col gap-10 py-10 text-gray-900 dark:text-white">
        {categoriesToRender.map((category) => (
          <MovieSlider key={category} category={category} />
        ))}
      </div>
    </>
  );
}
