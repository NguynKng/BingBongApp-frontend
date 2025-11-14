import { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import SpinnerLoading from "../components/SpinnerLoading";
import { motion } from "framer-motion";
import Meta from "../components/Meta";
import { newsApi } from "../services/api";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await newsApi.getNews();
        setNews(res.data.articles);
        setVisibleCount(10);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <>
      <Meta title="News" />
      <div className="lg:p-4 p-1 lg:ml-[20rem]">
        <div className="lg:w-[80%] w-full px-2 md:px-8 py-6">
          <h1 className="text-2xl text-green-500 font-bold">
            Latest News
          </h1>
          {loading ? (
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
          ) : (
            <div className="flex flex-col gap-4">
              {news.slice(0, visibleCount).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <NewsCard news={item} />
                </motion.div>
              ))}

              {visibleCount < news.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleLoadMore}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsPage;
