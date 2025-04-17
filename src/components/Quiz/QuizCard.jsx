import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

function QuizCard({ quiz }) {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (quiz && quiz.id) {
      navigate(`/quiz/play/${quiz.id}`); // ✅ Đã sửa lại path đúng
    } else {
      console.error("Quiz không hợp lệ!");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:rotate-3 hover:shadow-2xl p-6">
      <h3 className="text-2xl font-semibold text-white mb-2 transition-transform transform hover:scale-105 hover:text-teal-200 shadow-md hover:shadow-lg">
        {quiz.title}
      </h3>
      <p className="text-base text-gray-100 mb-2">{quiz.description}</p>
      <p className="text-base text-gray-100 mb-4">{quiz.questionCount} câu hỏi</p>
      <button
        onClick={handlePlayClick}
        className="flex items-center gap-2 text-white bg-gradient-to-r from-green-400 to-green-600 hover:scale-105 px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:translate-y-1"
      >
        <Gamepad2 size={18} />
        Chơi
      </button>
    </div>
  );
}

export default QuizCard;
