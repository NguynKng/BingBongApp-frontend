import React, { useState } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";

export default function QuizGame() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const user = { name: "Nguyen Van A", score: 250 };

  const handleStart = () => setStarted(true);
  const handleFinish = () => {
    setStarted(false);
    setFinished(true);
  };

  const handleRestart = () => {
    setStarted(false);
    setFinished(false);
    setSelectedAnswer(null);
  };

  const handleCreateQuestion = () => {
    alert("Chức năng 'Tạo câu hỏi' đang được phát triển!");
  };

  const handleViewLeaderboard = () => {
    alert("Chức năng 'Bảng xếp hạng' đang được phát triển!");
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 mt-[10vh] py-4">
        <motion.h2
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎯 Quiz Game
        </motion.h2>

        <motion.div
          className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-700 text-base mb-1">
            Xin chào, <strong>{user.name}</strong>!
          </p>
          <p className="text-gray-700 text-base">
            Điểm hiện tại: <strong>{user.score}</strong>
          </p>
        </motion.div>

        {!started && !finished && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={handleCreateQuestion}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              ✍️ Tạo câu hỏi
            </button>
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              🚀 Bắt đầu tham gia
            </button>
            <button
              onClick={handleViewLeaderboard}
              className="bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              🏆 Bảng xếp hạng
            </button>
          </motion.div>
        )}

        {started && (
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 mt-6"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl font-semibold text-indigo-700 mb-6">
              Câu hỏi 1: React là gì?
            </p>
            <div className="space-y-4">
              {["A", "B", "C", "D"].map((key, idx) => {
                const options = {
                  A: "A JavaScript library for building user interfaces",
                  B: "A CSS framework",
                  C: "Một phần mềm chỉnh ảnh",
                  D: "Game engine",
                };

                return (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswerSelect(key)}
                    className={`w-full border-2 px-4 py-3 rounded-xl text-left transition-all hover:bg-blue-50 ${
                      selectedAnswer === key
                        ? "bg-gradient-to-r from-blue-200 to-indigo-200 font-bold scale-105 shadow-md"
                        : ""
                    }`}
                  >
                    {options[key]}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 text-gray-700 text-sm">
              Câu trả lời đang chọn:{" "}
              <span className="font-semibold text-indigo-600">
                {selectedAnswer || "Chưa chọn"}
              </span>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={handleFinish}
                className="text-sm text-blue-500 hover:underline"
              >
                ⏹ Kết thúc sớm
              </button>
            </div>
          </motion.div>
        )}

        {finished && (
          <motion.div
            className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-2xl p-8 mt-6 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-extrabold text-green-600 mb-4">
              🎉 Hoàn thành!
            </h2>
            <p className="text-blue-800 text-lg mb-4">Điểm của bạn: 7/10</p>
            <button
              onClick={handleRestart}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-lg"
            >
              🔄 Chơi lại
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
}
