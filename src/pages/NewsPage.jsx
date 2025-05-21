import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import SpinnerLoading from "../components/SpinnerLoading";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Meta from "../components/Meta";

const NewsPage = () => {
  const { pageNumber } = useParams();
  const currentPage = parseInt(pageNumber || "1", 10);
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/crawlblog?pageNumber=${currentPage}`
        );
        setNews(res.data.articles);
        setVisibleCount(10);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handlePageChange = (page) => {
    if (page === 1) {
      navigate(`/news`);
      return;
    }
    navigate(`/news/page/${page}`);
  };

  return (
    <>
      <Meta title="Tin tức công nghệ" />
      <Header />
      <Navbar />
      <div className="relative pt-[64px] lg:ml-[24rem] flex bg-gradient-to-br from-[#f0f4ff] to-[#fff1f7] dark:from-[#1c1f2a] dark:to-[#2a2e3d]">
        <div className="lg:w-[80%] w-full px-2 md:px-8 min-h-[92vh] py-6">
          {loading ? (
            <SpinnerLoading />
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

              {visibleCount < news.length ? (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleLoadMore}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
                  >
                    Xem thêm
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {(() => {
                    const pageSize = 7;
                    const maxPage = 100;
                    const start =
                      Math.floor((currentPage - 1) / pageSize) * pageSize + 1;
                    const end = Math.min(start + pageSize - 1, maxPage);
                    const pagination = [];

                    if (start > 1) {
                      pagination.push(
                        <button
                          key="prev"
                          onClick={() => handlePageChange(start - 1)}
                          className="px-3 py-1 rounded cursor-pointer bg-gray-200 hover:bg-blue-100"
                        >
                          « Prev
                        </button>
                      );
                    }

                    for (let i = start; i <= end; i++) {
                      pagination.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-1 rounded cursor-pointer ${
                            currentPage === i
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 hover:bg-blue-100"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    if (end < maxPage) {
                      pagination.push(
                        <button
                          key="next"
                          onClick={() => handlePageChange(end + 1)}
                          className="px-3 py-1 rounded cursor-pointer bg-gray-200 hover:bg-blue-100"
                        >
                          Next »
                        </button>
                      );
                    }

                    return pagination;
                  })()}
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
