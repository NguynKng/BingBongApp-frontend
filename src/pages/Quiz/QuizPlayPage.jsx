import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"
import useAuthStore from "../../store/authStore";

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
  const { user } = useAuthStore()


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/quiz/${quizId}`);
        const quizData = response.data;
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

  const handleAnswerChange = (e) => {
    const newAnswer = e.target.value;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = newAnswer;
      return updated;
    });

    if (newAnswer === quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setAnswered(true);
  };

  // 👉 Hàm lưu điểm về backend
  const saveScore = async () => {
    if (!user) {
      console.error("❌ Không tìm thấy thông tin người dùng.");
      return;
    }
  
    try {
      const payload = {
        userId: user._id,  // ID người dùng lấy từ API /me
        quizId: quizId,    // ID bài quiz hiện tại
        score: score       // Số điểm đạt được
      };
  
      console.log("📤 Gửi điểm đến backend:", payload);
  
      const response = await axios.post(
        "http://localhost:8000/api/v1/quizScore/submit", // Đúng route bạn đã cấu hình
        payload,
        { withCredentials: true }
      );
  
      console.log("✅ Điểm đã được lưu thành công:", response.data);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
      console.error("❌ Gửi điểm thất bại:", msg);
    }
  };
  

  useEffect(() => {
    if (answered) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setAnswered(false);
        } else {
          setIsFinished(true);
          saveScore(); // 👉 Lưu điểm ngay khi kết thúc
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [answered, currentQuestionIndex, quiz?.questions?.length]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isFinished]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsFinished(true);
      saveScore(); // 👉 Lưu điểm nếu hết thời gian
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

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-500 text-xl">
        Đang tải quiz hoặc quiz không hợp lệ...
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-50">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-2">
          {quiz.title}
        </h1>
        <p className="text-center text-xl text-gray-600 mb-6">
          {quiz.description}
        </p>
        <div className="text-center mb-8">
          <span className="font-medium text-xl">⏳ Thời gian còn lại: </span>
          <span className="text-red-500 font-bold text-2xl">{timeLeft}s</span>
        </div>

        {!isFinished && (
          <div className="bg-white shadow-xl border border-gray-200 p-10 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Câu {currentQuestionIndex + 1}: {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentQuestion.options.map((option, i) => {
                const isSelected = answers[currentQuestionIndex] === option;
                const isCorrect = option === currentQuestion.correctAnswer;

                return (
                  <label
                    key={i}
                    className={`flex items-center justify-center text-xl p-6 rounded-2xl font-semibold cursor-pointer border-2 transition-all duration-300 text-center
                      ${answered
                          ? isCorrect
                            ? "bg-green-500 text-white border-green-600"
                            : isSelected
                            ? "bg-red-500 text-white border-red-600"
                            : "bg-white text-gray-800"
                          : "bg-white text-gray-800 hover:bg-indigo-100 hover:shadow-md"
                      }`}
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
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {isFinished && (
          <div className="bg-white border shadow-lg rounded-2xl p-10 text-center mt-8">
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              🎉 Bạn đã hoàn thành quiz!
            </h2>
            <p className="text-xl text-gray-700 mb-2">Điểm số của bạn là:</p>
            <p className="text-5xl font-bold text-indigo-700 mb-6">
              {score} / {quiz.questions.length}
            </p>
            <div className="flex justify-center gap-6 mt-4 flex-wrap">
              <button
                onClick={handleGoBack}
                className="px-8 py-3 text-lg bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              >
                🔙 Quay lại
              </button>
              <button
                onClick={handlePlayAgain}
                className="px-8 py-3 text-lg bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
              >
                🔄 Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPlayPage;