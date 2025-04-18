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
          <h2 className="text-2xl font-bold text-gray-800">🎮 Danh sách Quiz</h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/quiz/create")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              ➕ Tạo Quiz mới
            </button>
            <button
              onClick={() => navigate("/quiz/leaderboard")}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
            >
              🏆 Bảng xếp hạng
            </button>
          </div>
        </div>

        {/* Hiển thị danh sách quiz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </div>
    </>
  );
}