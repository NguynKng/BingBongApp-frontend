import React, { useState } from "react";
import Header from "../components/Header"; // Thanh header từ FriendPage

export default function QuizGame() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Trạng thái lưu câu trả lời được chọn
  const user = { name: "Nguyen Van A", score: 250 }; // Thông tin người dùng giả lập

  const handleStart = () => setStarted(true);
  const handleFinish = () => {
    setStarted(false);
    setFinished(true);
  };

  const handleRestart = () => {
    setStarted(false);
    setFinished(false);
    setSelectedAnswer(null); // Reset trạng thái câu trả lời
  };

  const handleCreateQuestion = () => {
    alert("Chức năng 'Tạo câu hỏi' đang được phát triển!");
  };

  const handleViewLeaderboard = () => {
    alert("Chức năng 'Bảng xếp hạng' đang được phát triển!");
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer); // Cập nhật câu trả lời được chọn
  };

  return (
    <>
      <Header /> {/* Sử dụng thanh header giống như trong FriendPage */}
      <div className="max-w-7xl mx-auto px-4 mt-[10vh] py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Game</h2>

        {/* Hiển thị thông tin người dùng */}
        <div className="bg-blue-100 rounded-xl shadow-md p-4 mb-6">
          <p className="text-gray-800 text-sm mb-2">Xin chào, <strong>{user.name}</strong>!</p>
          <p className="text-gray-800 text-sm">Điểm hiện tại: <strong>{user.score}</strong></p>
        </div>

        {/* Các nút chức năng chính */}
        {!started && !finished && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <button 
              onClick={handleCreateQuestion} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            >
              Tạo câu hỏi
            </button>
            <button 
              onClick={handleStart} 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full"
            >
              Bắt đầu tham gia
            </button>
            <button 
              onClick={handleViewLeaderboard} 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-full"
            >
              Bảng xếp hạng
            </button>
          </div>
        )}

        {/* Giao diện khi chơi */}
        {started && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <p className="text-lg font-semibold text-blue-800 mb-4">Câu hỏi 1: React là gì?</p>
            <div className="space-y-3">
              <button
                className={`w-full border px-4 py-2 rounded-md hover:bg-blue-100 ${
                  selectedAnswer === "A" ? "bg-blue-200 font-bold" : ""
                }`}
                onClick={() => handleAnswerSelect("A")}
              >
                A JavaScript library for building user interfaces
              </button>
              <button
                className={`w-full border px-4 py-2 rounded-md hover:bg-blue-100 ${
                  selectedAnswer === "B" ? "bg-blue-200 font-bold" : ""
                }`}
                onClick={() => handleAnswerSelect("B")}
              >
                A CSS framework
              </button>
              <button
                className={`w-full border px-4 py-2 rounded-md hover:bg-blue-100 ${
                  selectedAnswer === "C" ? "bg-blue-200 font-bold" : ""
                }`}
                onClick={() => handleAnswerSelect("C")}
              >
                Một phần mềm chỉnh ảnh
              </button>
              <button
                className={`w-full border px-4 py-2 rounded-md hover:bg-blue-100 ${
                  selectedAnswer === "D" ? "bg-blue-200 font-bold" : ""
                }`}
                onClick={() => handleAnswerSelect("D")}
              >
                Game engine
              </button>
            </div>
            <div className="mt-6">
              <p className="text-gray-800 text-sm">Câu trả lời đang chọn: {selectedAnswer || "Chưa chọn"}</p>
            </div>
            <div className="mt-4 text-right">
              <button 
                onClick={handleFinish} 
                className="text-sm text-blue-600 hover:underline"
              >
                Kết thúc sớm
              </button>
            </div>
          </div>
        )}

        {/* Giao diện khi hoàn thành */}
        {finished && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Hoàn thành!</h2>
            <p className="text-blue-800 mb-2">Điểm của bạn: 7/10</p>
            <button 
              onClick={handleRestart} 
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Chơi lại
            </button>
          </div>
        )}
      </div>
    </>
  );
}
