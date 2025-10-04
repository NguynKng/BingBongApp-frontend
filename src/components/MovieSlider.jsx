import { useEffect, useRef, useState } from "react";
import { SMALL_IMG_BASE_URL } from "../utils/movie_constants";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tmdbAPI } from "../services/api";
import useMovieStore from "../store/movieStore";
import SpinnerLoading from "./SpinnerLoading";

export default function MovieSlider({ category }) {
  const { contentType } = useMovieStore();
  const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";
  const formattedCategories =
    category.replaceAll("_", " ")[0].toUpperCase() +
    category.replaceAll("_", " ").slice(1);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef();

  useEffect(() => {
    const getContent = async () => {
      setLoading(true);
      try {
        let res;
        if (contentType === "movie") {
          res = await tmdbAPI.getMoviesByCategory(category);
        } else {
          res = await tmdbAPI.getTVShowByCategory(category);
        }
        setContent(res.content);
      } catch (error) {
        console.error("Error fetching content:", error.message);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };
    getContent();
  }, [contentType, category]);

  const scrollLeft = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };

  const scrollRight = () => {
    if (sliderRef.current)
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
  };

  return (
    <div
      className="text-white relative px-4 md:pr-20 md:pl-30"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="relative">
        <h1 className="text-3xl font-bold mb-4 text-green-500">
          {formattedCategories} {formattedContentType}
        </h1>

        {/* Hiển thị spinner khi đang fetch API */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <SpinnerLoading />
          </div>
        ) : content.length > 0 ? (
          <div
            className="flex gap-6 overflow-x-scroll custom-scroll"
            ref={sliderRef}
          >
            {content.map((item) => (
              <Link
                to={`/movie/${item.id}`}
                className="min-w-[250px] relative group"
                key={item.id}
              >
                <div className="rounded-lg overflow-hidden relative">
                  {imgLoading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-900">
                      <SpinnerLoading size="small" />
                    </div>
                  )}
                  <img
                    src={`${SMALL_IMG_BASE_URL}/${item.backdrop_path}`}
                    alt="Movie image"
                    className="transition-transform duration-500 ease-in-out group-hover:scale-125"
                    loading="lazy"
                    onLoad={() => setImgLoading(false)}
                  />
                </div>
                <h1 className="mt-2 font-bold group-hover:text-orange-300 text-black dark:text-white">
                  {item.title || item.name}
                </h1>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No {formattedContentType} found</p>
        )}

        {showArrows && !loading && (
          <>
            <button
              className="absolute top-1/2 cursor-pointer -translate-y-1/2 left-2 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 text-white z-10"
              onClick={scrollLeft}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute top-1/2 cursor-pointer -translate-y-1/2 right-2 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-60 hover:bg-opacity-75 text-white z-10"
              onClick={scrollRight}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
