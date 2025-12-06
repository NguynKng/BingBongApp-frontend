import { useEffect, useState, useCallback, useMemo, memo } from "react";
import NewsCard from "../components/NewsCard";
import SpinnerLoading from "../components/SpinnerLoading";
import { motion } from "framer-motion";
import Meta from "../components/Meta";
import useNewsStore from "../store/newsStore";

const NewsPage = memo(() => {
  const { news, loading, fetchNews } = useNewsStore();
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // ✅ useCallback for handleLoadMore
  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 10);
  }, []);

  // ✅ Memoize visible news items
  const visibleNews = useMemo(
    () => news.slice(0, visibleCount),
    [news, visibleCount]
  );

  // ✅ Memoize hasMore check
  const hasMore = useMemo(
    () => visibleCount < news.length,
    [visibleCount, news.length]
  );

  return (
    <>
      <Meta title="News" />
      <div className="lg:p-4 p-1 lg:ml-[20rem]">
        <div className="lg:w-[80%] w-full px-2 md:px-8 py-6">
          <h1 className="text-2xl text-green-500 font-bold">Latest News</h1>

          {loading ? (
            <LoadingState />
          ) : (
            <div className="flex flex-col gap-4">
              {visibleNews.map((item, index) => (
                <NewsCardItem key={item.url || index} item={item} index={index} />
              ))}

              {hasMore && <LoadMoreButton onClick={handleLoadMore} />}
            </div>
          )}
        </div>
      </div>
    </>
  );
});

NewsPage.displayName = "NewsPage";

// ✅ Extract LoadingState component
const LoadingState = memo(() => (
  <div className="flex flex-col justify-center items-center h-[50vh] gap-4 text-center">
    <SpinnerLoading />
    <motion.h2
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-lg font-semibold text-gray-600 dark:text-gray-300"
    >
      Loading articles...
    </motion.h2>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Please wait a moment
    </p>
  </div>
));

LoadingState.displayName = "LoadingState";

// ✅ Extract NewsCardItem component
const NewsCardItem = memo(({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    <NewsCard news={item} />
  </motion.div>
));

NewsCardItem.displayName = "NewsCardItem";

// ✅ Extract LoadMoreButton component
const LoadMoreButton = memo(({ onClick }) => (
  <div className="flex justify-center mt-6">
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
    >
      Load More
    </button>
  </div>
));

LoadMoreButton.displayName = "LoadMoreButton";

export default NewsPage;