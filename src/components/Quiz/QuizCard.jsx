import { useNavigate } from "react-router-dom";
import { Gamepad2, Trash2 } from "lucide-react";

function QuizCard({ quiz, onDelete }) {
  const navigate = useNavigate();

  const handlePlayClick = (id) => {
    navigate(`/quiz/play/${id}`);
  };

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-tr from-purple-100 to-indigo-100 border border-purple-300 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 transform hover:scale-105">
      {/* Nút xóa ở góc trên phải */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
          title="Xóa quiz"
        >
          <Trash2 size={20} />
        </button>
      )}

      {/* Tiêu đề */}
      <h3 className="text-xl font-bold text-center text-purple-800 border border-purple-500 rounded-lg px-3 py-2 bg-white shadow mb-4">
        {quiz.title}
      </h3>

      {/* Mô tả */}
      <p className="text-gray-700 text-base mb-2 line-clamp-3">
        {quiz.description}
      </p>

      {/* Số câu hỏi */}
      <p className="text-gray-600 text-sm mb-4">{quiz.questionCount} câu hỏi</p>

      {/* Nút chơi ở dưới cùng */}
      <div className="mt-auto flex justify-end">
        <button
          onClick={() => handlePlayClick(quiz._id)}
          className="flex items-center gap-2 text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:scale-95 px-4 py-2 rounded-lg transition transform focus:outline-none focus:ring-2 focus:ring-green-400 shadow cursor-pointer"
        >
          <Gamepad2 size={18} />
          Chơi
        </button>
      </div>
    </div>
  );
}

export default QuizCard;
