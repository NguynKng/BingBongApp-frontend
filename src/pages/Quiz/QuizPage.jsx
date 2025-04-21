import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import QuizCard from "../../components/Quiz/QuizCard";
import axios from "axios";

export default function QuizPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]); // Khởi tạo state quizzes với dữ liệu mock
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/quiz", {
          withCredentials: true, // nếu có dùng cookie để xác thực
        });

        const data = response.data;

        // Kiểm tra nếu data.quizzes là mảng thì set vào state
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
  }, []); // Chỉ gọi API khi component mount lần đầu

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-6 mt-[10vh]">
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 mb-8 text-center drop-shadow-lg animate-pulse">
            🎮 Danh sách Quiz
          </h2>
          <div className="flex gap-4 mt-4 md:mt-0">
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

        {/* Hiển thị danh sách quiz */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 py-8">
              Không có quiz nào để hiển thị.
            </div>
          )}
        </section>
      </main>
    </>
  );
}
