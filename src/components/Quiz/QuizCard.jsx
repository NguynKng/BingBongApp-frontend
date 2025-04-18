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
        className="bg-white border rounded-xl shadow hover:shadow-lg transition p-4 mb-4"
      >
        <h3 className="text-lg font-semibold mb-1">{quiz.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
        <p className="text-sm text-gray-400 mb-4">
          {quiz.questionCount} câu hỏi
        </p>
        <button
          onClick={() => handlePlayClick(quiz._id)}
          className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg cursor-pointer"
        >
          <Gamepad2 size={18} />
          Chơi
        </button>
      </div>
    </div>
  );
}

export default QuizCard;
