import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizData from "../../data/quizplay";

function QuizPlayPage() {
  const { quizId } = useParams();
  const quiz = quizData.find(q => q.id === parseInt(quizId, 10));
  const navigate = useNavigate();

  if (!quiz) {
    return <div className="text-red-500">Quiz không tồn tại.</div>;
  }

  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswerChange = (e) => {
    const newAnswer = e.target.value;
    setAnswers(prev => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentQuestionIndex] = newAnswer;
      return updatedAnswers;
    });

    if (newAnswer === quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    setAnswered(true);
  };

  useEffect(() => {
    if (answered) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnswered(false);
        } else {
          setIsFinished(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [answered, currentQuestionIndex, quiz.questions.length]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isFinished]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft]);

  const handleGoBack = () => {
    navigate("/quiz");
  };

  const handlePlayAgain = () => {
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setAnswers(Array(quiz.questions.length).fill(null));
    setScore(0);
    setTimeLeft(60);
    setAnswered(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text mb-4">
        {quiz.title}
      </h1>
      <p className="text-lg text-gray-700 mb-6 italic">{quiz.description}</p>

      <div className="mb-4 text-lg">
        ⏱️ <span className="font-semibold">Thời gian còn lại:</span>{" "}
        <span className="text-red-600 font-bold">{timeLeft}s</span>
      </div>

      <div className="question mb-6 p-6 bg-white rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.01]">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          {quiz.questions[currentQuestionIndex].question}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {quiz.questions[currentQuestionIndex].options.map((option, i) => {
            const isCorrect = option === quiz.questions[currentQuestionIndex].correctAnswer;
            const isSelected = answers[currentQuestionIndex] === option;
            const statusClass = answered
              ? isCorrect
                ? "bg-gradient-to-r from-green-400 to-green-600 text-white"
                : isSelected
                ? "bg-gradient-to-r from-red-400 to-red-600 text-white"
                : "bg-gray-100"
              : "bg-white";

            return (
              <label
                key={i}
                className={`p-4 rounded-xl border-2 shadow-lg cursor-pointer transform transition duration-300 hover:scale-105 ${statusClass}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  checked={isSelected}
                  onChange={handleAnswerChange}
                  disabled={answered}
                  className="hidden"
                />
                <span className="text-md font-medium">{option}</span>
              </label>
            );
          })}
        </div>
      </div>

      {isFinished && (
        <div className="mt-8 p-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl shadow-lg animate-fade-in">
          <p className="text-2xl font-bold text-indigo-800 mb-2">🎉 Bạn đã hoàn thành Quiz!</p>
          <p className="text-xl font-semibold text-gray-700">
            Điểm của bạn là: <span className="text-indigo-600">{score}/{quiz.questions.length}</span>
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow hover:scale-105 transition"
            >
              Quay lại
            </button>
            <button
              onClick={handlePlayAgain}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow hover:scale-105 transition"
            >
              Chơi lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizPlayPage;
