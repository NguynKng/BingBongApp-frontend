import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import QuizCard from "../../components/Quiz/QuizCard";
import axios from "axios";

export default function QuizPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/quiz", {
          withCredentials: true,
        });

        const data = response.data;

        if (Array.isArray(data.quizzes)) {
          setQuizzes(data.quizzes);
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quiz:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <>
      <Header />
      <div className="dark:bg-[#181826] min-h-[92vh] mt-[64px] pt-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-center drop-shadow-lg animate-pulse dark:drop-shadow-[0_2px_12px_rgba(80,80,255,0.3)]">
              🎮 Danh sách Quiz
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/quiz/create")}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                ➕ Tạo Quiz mới
              </button>
              <button
                onClick={() => navigate("/quiz/leaderboard")}
                className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                🏆 Bảng xếp hạng
              </button>
            </div>
          </div>

          {/* Danh sách Quiz */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                Không có quiz nào để hiển thị.
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
