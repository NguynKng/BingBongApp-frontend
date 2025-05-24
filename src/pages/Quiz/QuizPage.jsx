import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import QuizCard from "../../components/Quiz/QuizCard";
import { quizAPI } from "../../services/api";
import debounce from "lodash.debounce";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import quizTopics from "../../data/quizTopic";

export default function QuizPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);

  const debouncedSearch = debounce((text) => {
    setSearchText(text);
  }, 500);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await quizAPI.getAllQuizzes();
        if (Array.isArray(response.quizzes)) {
          setAllQuizzes(response.quizzes);
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quiz:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const filteredQuizzes = useMemo(() => {
    return allQuizzes.filter((quiz) => {
      const matchTopic =
        selectedTopics.length === 0 ||
        (Array.isArray(quiz.topic) &&
          quiz.topic.some((t) =>
            selectedTopics.some(
              (selected) => selected.toLowerCase() === t.toLowerCase()
            )
          ));

      const matchSearch = searchText
        ? quiz.title.toLowerCase().includes(searchText.toLowerCase())
        : true;

      return matchTopic && matchSearch;
    });
  }, [allQuizzes, searchText, selectedTopics]);

  return (
    <div className="dark:bg-[#181826] min-h-[92vh]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header: search & buttons */}
        <section className="bg-white dark:bg-[#1f2233] rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="w-full md:w-1/2 relative">
            <Search className="absolute size-5 top-2.5 left-3 text-blue-700" />
            <input
              type="text"
              placeholder="Tìm kiếm Quiz..."
              className="w-full py-2 pl-10 pr-4 bg-white/90 dark:bg-[#2a2d43] text-blue-900 dark:text-gray-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-400 shadow transition duration-300"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate("/quiz/create")}
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer"
            >
              ➕ Tạo Quiz mới
            </button>
            <button
              onClick={() => navigate("/quiz/leaderboard")}
              className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300 cursor-pointer"
            >
              🏆 Bảng xếp hạng
            </button>
          </div>
        </section>

        {/* Topic selector */}
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-center drop-shadow-lg animate-pulse dark:drop-shadow-[0_2px_12px_rgba(80,80,255,0.3)]">
          🎮 Danh sách Quiz
        </h2>
        <div className="grid lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedTopics([])}
            className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors duration-300 ${
              selectedTopics.length === 0
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white"
            }`}
          >
            🌀 Tất cả
          </button>
          {quizTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => toggleTopic(topic.name)}
              className={`px-4 py-2 cursor-pointer rounded-lg text-sm flex gap-2 items-center font-medium transition-colors duration-300 ${
                selectedTopics.includes(topic.name)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white"
              }`}
            >
              <img src={topic.image} className="size-10 object-cover" />
              <span>{topic.name}</span>
            </button>
          ))}
        </div>

        {/* Quiz cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                onDelete={async () => {
                  try {
                    const result = await Swal.fire({
                      title: "Bạn có chắc chắn?",
                      text: "Quiz sẽ bị xóa vĩnh viễn!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#3085d6",
                      confirmButtonText: "Xóa!",
                      cancelButtonText: "Hủy",
                    });

                    if (result.isConfirmed) {
                      await quizAPI.deleteQuiz(quiz._id);
                      setAllQuizzes((prev) =>
                        prev.filter((q) => q._id !== quiz._id)
                      );

                      await Swal.fire({
                        icon: "success",
                        title: "Đã xóa!",
                        text: "Quiz đã được xóa thành công.",
                        timer: 1500,
                        showConfirmButton: false,
                      });
                    }
                  } catch (err) {
                    await Swal.fire({
                      icon: "error",
                      title: "Xóa thất bại!",
                      text: err.message || "Đã có lỗi xảy ra.",
                    });
                  }
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
              Không có quiz nào phù hợp với chủ đề tìm kiếm của bạn.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
