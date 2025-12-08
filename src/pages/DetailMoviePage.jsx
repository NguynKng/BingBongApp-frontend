import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { useParams, Link } from "react-router-dom";
import useMovieStore from "../store/movieStore";
import { ChevronLeft, ChevronRight, Star, Calendar, Clock, Play } from "lucide-react";
import ReactPlayer from "react-player";
import {
  ORIGINAL_IMG_BASE_URL,
  SMALL_IMG_BASE_URL,
} from "../utils/movie_constants";
import WatchPageSkeleton from "../components/WatchPageSkeleton";
import { formattedRunTime } from "../utils/timeUtils";
import { tmdbAPI } from "../services/api";
import SpinnerLoading from "../components/SpinnerLoading";

export default function DetailMoviePage() {
  const { id } = useParams();
  const [trailer, setTrailer] = useState([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useMovieStore();
  const [credits, setCredits] = useState([]);
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [seasonTVShow, setSeasonTVShow] = useState([]);
  const sliderRef = useRef(null);
  const sliderCastRef = useRef(null);

  // ✅ Memoize current trailer
  const currentTrailer = useMemo(
    () => trailer[currentTrailerIdx],
    [trailer, currentTrailerIdx]
  );

  // ✅ Memoize release year
  const releaseYear = useMemo(
    () =>
      content?.release_date?.split("-")[0] ||
      content?.first_air_date?.split("-")[0],
    [content]
  );

  // ✅ Memoize runtime/seasons text
  const durationText = useMemo(() => {
    if (!content) return "";
    return content.runtime
      ? formattedRunTime(content.runtime)
      : `${content.number_of_seasons} ${
          content.number_of_seasons > 1 ? "Seasons" : "Season"
        }`;
  }, [content]);

  // ✅ Memoize truncated overview
  const truncatedOverview = useMemo(() => {
    if (!content?.overview) return "";
    if (content.overview.length <= 200) return content.overview;
    return content.overview.slice(0, content.overview.lastIndexOf(" ", 200)) + "...";
  }, [content]);

  // ✅ Memoize backdrop URL
  const backdropUrl = useMemo(
    () => content?.backdrop_path ? ORIGINAL_IMG_BASE_URL + content.backdrop_path : "",
    [content]
  );

  // ✅ Memoize vote average
  const voteAverage = useMemo(
    () => content?.vote_average?.toFixed(1) || "N/A",
    [content]
  );

  // ✅ useCallback for handlers
  const handleNext = useCallback(() => {
    setCurrentTrailerIdx((prev) => 
      prev < trailer.length - 1 ? prev + 1 : prev
    );
  }, [trailer.length]);

  const handlePre = useCallback(() => {
    setCurrentTrailerIdx((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleImageLoad = useCallback(() => {
    setImgLoading(false);
  }, []);

  const scrollLeft = useCallback(() => {
    sliderRef.current?.scrollBy({
      left: -sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  }, []);

  const scrollRight = useCallback(() => {
    sliderRef.current?.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth",
    });
  }, []);

  const scrollLeftCast = useCallback(() => {
    sliderCastRef.current?.scrollBy({
      left: -sliderCastRef.current.offsetWidth,
      behavior: "smooth",
    });
  }, []);

  const scrollRightCast = useCallback(() => {
    sliderCastRef.current?.scrollBy({
      left: sliderCastRef.current.offsetWidth,
      behavior: "smooth",
    });
  }, []);

  const handleSeasonChange = useCallback((e) => {
    setSeasonNumber(e.target.value);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trailerRes, similarRes, detailRes, creditRes] = await Promise.allSettled([
          tmdbAPI.getContentTrailer(id, contentType),
          tmdbAPI.getSimilarContent(id, contentType),
          tmdbAPI.getContentDetail(id, contentType),
          tmdbAPI.getContentCredit(id, contentType),
        ]);

        if (trailerRes.status === "fulfilled") setTrailer(trailerRes.value.content);
        if (similarRes.status === "fulfilled") setSimilarContent(similarRes.value.content);
        if (detailRes.status === "fulfilled") setContent(detailRes.value.content);
        if (creditRes.status === "fulfilled") setCredits(creditRes.value.content.cast);

        if (contentType === "tv") {
          try {
            const episodeRes = await tmdbAPI.getTVShowEpisode(id, seasonNumber);
            setSeasonTVShow(episodeRes.content);
          } catch (error) {
            console.error("Failed to fetch episodes:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, contentType, seasonNumber]);

  useEffect(() => {
    setSeasonNumber(1);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-gray-900 dark:text-white h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mx-auto px-4 py-8 h-full flex flex-col justify-center">
            <h2 className="text-2xl mb-10 sm:text-5xl font-bold">
              Content not found 😢
            </h2>
            <Link to="/movie" className="text-blue-600 hover:text-blue-700 text-2xl font-semibold">
              ← Go Back to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative text-gray-900 dark:text-white h-[92vh]">
        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-300/70 dark:bg-black/70 flex items-center justify-center -z-10 shimmer" />
        )}

        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={backdropUrl}
            className="absolute top-0 left-0 object-cover w-full h-full"
            alt="Movie Background"
            onLoad={handleImageLoad}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-white/70 dark:from-black dark:via-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white dark:from-black to-transparent" />
        </div>

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl space-y-6">
              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight">
                {content.title || content.name}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Calendar size={16} className="text-gray-700 dark:text-white" />
                  <span className="font-medium text-gray-900 dark:text-white">{releaseYear}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-gray-900 dark:text-white">{voteAverage}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Clock size={16} className="text-gray-700 dark:text-white" />
                  <span className="font-medium text-gray-900 dark:text-white">{durationText}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-200/80 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  {content?.adult ? (
                    <span className="text-red-600 dark:text-red-400 font-bold">18+</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 font-bold">PG-13</span>
                  )}
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {content.genres.slice(0, 3).map((genre) => (
                  <Link
                    key={genre.id}
                    to="#"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              {/* Overview */}
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                {truncatedOverview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Trailers Section */}
          {trailer.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Trailers & Videos
                </h2>
                <div className="flex gap-2">
                  <button
                    className={`bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 cursor-pointer dark:text-white p-2 rounded-lg transition-colors ${
                      currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentTrailerIdx === 0}
                    onClick={handlePre}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className={`bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 cursor-pointer dark:text-white p-2 rounded-lg transition-colors ${
                      currentTrailerIdx === trailer.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={currentTrailerIdx === trailer.length - 1}
                    onClick={handleNext}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                {currentTrailer?.site === "YouTube" && (
                  <ReactPlayer
                    controls
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentTrailer.key}`}
                  />
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="text-gray-900 dark:text-white">
                  <span className="text-xl font-semibold">{currentTrailer?.type}</span>
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    {currentTrailer?.name}
                  </span>
                </p>
              </div>
            </div>
          )}

          {trailer.length === 0 && (
            <div className="text-center py-12 mb-16">
              <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No trailers available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                for <span className="font-bold">{content.title || content.name}</span>
              </p>
            </div>
          )}

          {/* TV Show Episodes */}
          {contentType === "tv" && seasonTVShow && (
            <div className="mb-16">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Episodes
                </h2>
                {content.number_of_seasons > 1 && (
                  <select
                    value={seasonNumber}
                    onChange={handleSeasonChange}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    {content.seasons.map((season) => (
                      <option
                        key={season.id}
                        value={season.season_number}
                      >
                        Season {season.season_number}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {seasonTVShow.name} • {seasonTVShow.air_date?.split("-")[0]}
              </p>
              {seasonTVShow.overview && (
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {seasonTVShow.overview}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seasonTVShow.episodes?.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    contentPoster={content.poster_path}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cast Section */}
          {credits.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Cast</h2>
                <div className="flex gap-2">
                  <button
                    onClick={scrollLeftCast}
                    className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={scrollRightCast}
                    className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div
                className="flex gap-6 overflow-x-auto custom-scroll pb-4"
                ref={sliderCastRef}
              >
                {credits.map((item) => (
                  <CastCard key={item.id} cast={item} />
                ))}
              </div>
            </div>
          )}

          {/* More Details */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              More Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DetailCard>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Genres
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {content.genres.map((genre, index) => (
                    <span key={genre.id}>
                      <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {genre.name}
                      </Link>
                      {index < content.genres.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </DetailCard>

              <DetailCard>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Audio Languages
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {content.spoken_languages.map((language, index) => (
                    <span key={index}>
                      {language.name}
                      {index < content.spoken_languages.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </DetailCard>

              <DetailCard>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Status
                </h3>
                <p className="text-gray-900 dark:text-white">{content.status}</p>
              </DetailCard>

              <DetailCard>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Rating
                </h3>
                <p className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  {voteAverage} / 10
                </p>
              </DetailCard>
            </div>
          </div>

          {/* Similar Content */}
          {similarContent.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                More Like This
              </h2>
              <div className="relative group">
                <div
                  className="flex overflow-x-auto custom-scroll gap-6 pb-4"
                  ref={sliderRef}
                >
                  {similarContent.map((item) => {
                    if (item.poster_path === null) return null;
                    return (
                      <SimilarCard key={item.id} item={item} />
                    );
                  })}
                </div>
                <button
                  className="absolute top-1/2 -translate-y-1/2 -left-4 bg-gray-900/80 hover:bg-gray-900 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg cursor-pointer"
                  onClick={scrollLeft}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="absolute top-1/2 -translate-y-1/2 -right-4 bg-gray-900/80 hover:bg-gray-900 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg cursor-pointer"
                  onClick={scrollRight}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ✅ Memoized Components
const EpisodeCard = memo(({ episode, contentPoster }) => {
  const truncatedOverview = useMemo(() => {
    if (!episode?.overview) return "";
    if (episode.overview.length <= 120) return episode.overview;
    return episode.overview.slice(0, episode.overview.lastIndexOf(" ", 120)) + "...";
  }, [episode]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800">
      <div className="relative h-48">
        <img
          className="object-cover w-full h-full"
          src={
            episode.still_path
              ? SMALL_IMG_BASE_URL + episode.still_path
              : SMALL_IMG_BASE_URL + contentPoster
          }
          alt={episode.name}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
            {episode.episode_number}. {episode.name}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {formattedRunTime(episode.runtime)}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {truncatedOverview}
        </p>
      </div>
    </div>
  );
});

EpisodeCard.displayName = "EpisodeCard";

const CastCard = memo(({ cast }) => {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <div className="min-w-[180px] group">
      <div className="rounded-xl overflow-hidden relative h-64 bg-gray-200 dark:bg-gray-800 shadow-md">
        {imgLoading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <SpinnerLoading size="small" />
          </div>
        )}
        <img
          src={cast.profile_path ? SMALL_IMG_BASE_URL + cast.profile_path : "/user.png"}
          alt={cast.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onLoad={() => setImgLoading(false)}
        />
      </div>
      <h3 className="mt-3 font-semibold text-gray-900 dark:text-white line-clamp-2">
        {cast.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
        {cast.character}
      </p>
    </div>
  );
});

CastCard.displayName = "CastCard";

const DetailCard = memo(({ children }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
    {children}
  </div>
));

DetailCard.displayName = "DetailCard";

const SimilarCard = memo(({ item }) => (
  <Link
    to={`/movie/${item.id}`}
    className="min-w-[200px] h-92"
  >
    <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800">
      <div className="relative h-72">
        <img
          src={SMALL_IMG_BASE_URL + item.poster_path}
          alt={item.title || item.name}
          className="w-full h-full object-cover transition-transform duration-500"
        />
      </div>
      <div className="p-4 h-20 bg-white dark:bg-gray-900">
        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 transition-colors">
          {item.title || item.name}
        </h4>
      </div>
    </div>
  </Link>
));

SimilarCard.displayName = "SimilarCard";