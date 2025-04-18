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
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      </div>
    </>
  );
}