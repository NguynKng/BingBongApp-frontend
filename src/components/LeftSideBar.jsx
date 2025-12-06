import { useEffect, useState, useMemo, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useNewsStore from "../store/newsStore";
import SpinnerLoading from "./SpinnerLoading";
import { formatTime } from "../utils/timeUtils";
import { Link } from "react-router-dom";

const LeftSidebar = memo(() => {
  const { news, loading, fetchNews } = useNewsStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // ✅ Memoize slides
  const slides = useMemo(() => {
    const chunk = [];
    for (let i = 0; i < news.length; i += 6) {
      chunk.push(news.slice(i, i + 6));
    }
    return chunk;
  }, [news]);

  // ✅ useCallback for slide change
  const handleSlideChange = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Auto slide
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1 < slides.length ? prev + 1 : 0));
    }, 7000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="w-full">
      <div className="shadow-lg rounded-lg w-full p-3 bg-white dark:bg-[#1b1f2b] border border-gray-100 dark:border-gray-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-semibold text-gray-800 dark:text-gray-100">
            Latest News
          </h1>
          <Link
            to="/news"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            More
          </Link>
        </div>

        <div className="relative overflow-hidden h-[34rem]">
          {loading && news.length === 0 ? (
            <SpinnerLoading />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute w-full"
              >
                <div className="space-y-3">
                  {slides[currentSlide]?.map((item, index) => (
                    <NewsItem key={`${item.url}-${index}`} item={item} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Dots indicator */}
        {slides.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-blue-500 scale-125"
                    : "bg-gray-400 dark:bg-gray-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

LeftSidebar.displayName = "LeftSidebar";

// ✅ Extract NewsItem component with memo
const NewsItem = memo(({ item }) => {
  const { title, url, urlToImage, publishedAt } = item;

  const handleImageLoad = useCallback((e) => {
    e.currentTarget.classList.remove("opacity-0");
  }, []);

  const handleImageError = useCallback((e) => {
    e.currentTarget.src = "/none-image.jfif";
    e.currentTarget.classList.remove("opacity-0");
  }, []);

  return (
    <Link
      to={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#2a2f40] transition"
    >
      <div className="w-20 h-16 flex-shrink-0">
        <img
          src={urlToImage || "/none-image.jfif"}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover rounded-lg opacity-0 transition-opacity duration-500"
          referrerPolicy="no-referrer"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {formatTime(publishedAt)}
        </p>
      </div>
    </Link>
  );
});

NewsItem.displayName = "NewsItem";

export default LeftSidebar;