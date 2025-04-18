import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function QuizPlayPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Gọi API để lấy quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/quiz/${quizId}`
        );

        const quizData = response.data;

        // Debug: Xem rõ dữ liệu trả về
        console.log("Dữ liệu trả về từ API:", quizData);

        // Nếu dữ liệu thực nằm trong quizData.quiz → gán lại quizData
        const actualQuiz = quizData.questions ? quizData : quizData.quiz;

        if (!Array.isArray(actualQuiz.questions)) {
          throw new Error("Quiz không hợp lệ: questions phải là mảng");
        }

        setQuiz(actualQuiz);
        setAnswers(Array(actualQuiz.questions.length).fill(null));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu quiz:", error.message || error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Xử lý chọn đáp án
  const handleAnswerChange = (e) => {
    const newAnswer = e.target.value;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = newAnswer;
      return updated;
    });

    // Kiểm tra câu trả lời đúng/sai
    if (newAnswer === quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setAnswered(true);
  };

  // Tự động chuyển câu hỏi
  useEffect(() => {
    if (answered) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setAnswered(false);
        } else {
          setIsFinished(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [answered, currentQuestionIndex, quiz?.questions?.length]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, isFinished]);

  // Dừng lại khi hoàn thành quiz hoặc thời gian hết
  useEffect(() => {
    if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft]);

  // Điều hướng quay lại trang quiz danh sách
  const handleGoBack = () => {
    navigate("/quiz");
  };

  // Điều hướng chơi lại quiz
  const handlePlayAgain = () => {
    setIsFinished(false);
    setCurrentQuestionIndex(0);
    setAnswers(Array(quiz.questions.length).fill(null));
    setScore(0);
    setTimeLeft(60);
    setAnswered(false);
  };

  // Nếu quiz chưa tải hoặc không có questions
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div>Đang tải quiz hoặc quiz không hợp lệ...</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{quiz.description}</p>
      <div className="mb-4">
        <span className="font-semibold text-lg">Thời gian còn lại: </span>
        <span className="text-red-500">{timeLeft} giây</span>
      </div>
      <div className="question mb-6 p-4 border border-gray-300 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          {currentQuestion.question}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((option, i) => (
            <label
              key={i}
              className={`flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer transition 
               ${
                 answered &&
                 (option === currentQuestion.correctAnswer
                   ? "bg-green-100"
                   : option === answers[currentQuestionIndex]
                   ? "bg-red-100"
                   : "")
               }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={answers[currentQuestionIndex] === option}
                onChange={handleAnswerChange}
                disabled={answered}
                className="hidden"
              />
              <span className="text-lg">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Hiển thị điểm số khi hoàn thành quiz */}
      {isFinished && (
        <div className="mt-6 text-xl">
          <p className="font-semibold">Bạn đã hoàn thành Quiz!</p>
          <p className="text-lg">
            Điểm của bạn là: {score}/{quiz.questions.length}
          </p>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Quay lại
            </button>
            <button
              onClick={handlePlayAgain}
              className="px-6 py-2 bg-green-500 text-white rounded-lg"
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
