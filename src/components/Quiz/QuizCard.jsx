import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

function QuizCard({ quiz }) {
  const navigate = useNavigate();

  const handlePlayClick = (id) => {
    navigate(`/quiz/play/${id}`);
  };

  return (
    <div>
      <div
        key={quiz._id}
        className="bg-gradient-to-tr from-purple-100 to-indigo-100 border border-purple-300 rounded-xl shadow-lg hover:shadow-xl transition p-4 mb-6 transform hover:scale-105"
      >
        {/* Tiêu đề có khung màu tím */}
        <h3 className="text-2xl font-bold mb-3 text-center text-purple-800 border border-purple-500 rounded-lg px-3 py-2 bg-white shadow">
          {quiz.title}
        </h3>

        {/* Mô tả */}
        <p className="text-lg text-gray-700 mb-2">{quiz.description}</p>

        {/* Số câu hỏi */}
        <p className="text-xl text-gray-600 mb-4">
          {quiz.questionCount} câu hỏi
        </p>

        {/* Nút chơi */}
        <button
          onClick={() => handlePlayClick(quiz._id)}
          className="flex items-center gap-2 text-white bg-gradient-to-r from-green-400 to-green-600 hover:bg-orange-500 active:bg-orange-700 px-4 py-2 rounded-lg cursor-pointer transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 shadow ml-auto"
        >
          <Gamepad2 size={18} />
          Chơi
        </button>
      </div>
    </div>
  );
}

export default QuizCard;
