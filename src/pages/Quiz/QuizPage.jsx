import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import QuizCard from "../../components/Quiz/QuizCard"; // Import đúng QuizCard
import mockQuizzes from "../../data/quiz"; // Import mockQuizzes dữ liệu quiz

export default function QuizPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 mt-[10vh] py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600 transform transition-transform hover:scale-105 hover:rotate-2 duration-500 ease-in-out">
            🎮 Danh sách Quiz
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/quiz/create")}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:rotate-1 duration-300 ease-in-out hover:shadow-2xl"
            >
              ➕ Tạo Quiz mới
            </button>
            <button
              onClick={() => navigate("/quiz/leaderboard")}
              className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:rotate-1 duration-300 ease-in-out hover:shadow-2xl"
            >
              🏆 Bảng xếp hạng
            </button>
          </div>
        </div>

        {/* Hiển thị danh sách quiz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => (
            <div className="transform transition-transform hover:scale-105 hover:rotate-2 duration-300 ease-in-out hover:shadow-lg">
              <QuizCard key={quiz.id} quiz={quiz} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
