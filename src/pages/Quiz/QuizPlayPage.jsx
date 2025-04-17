/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizData from "../../data/quizplay"; 

function QuizPlayPage() {
  const { quizId } = useParams(); // Lấy quizId từ URL
  const quiz = quizData.find(q => q.id === parseInt(quizId, 10)); // Tìm quiz tương ứng
  const navigate = useNavigate(); // Hook để điều hướng trang

  // Kiểm tra xem quiz có tồn tại không
  if (!quiz) {
    return <div className="text-red-500">Quiz không tồn tại.</div>; // Nếu không tìm thấy quiz
  }

  // State lưu trữ câu trả lời của người dùng
  const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null)); // Lưu đáp án của người dùng
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Chỉ số câu hỏi hiện tại
  const [score, setScore] = useState(0); // Điểm số hiện tại
  const [timeLeft, setTimeLeft] = useState(60); // Thời gian đếm ngược (giây)
  const [isFinished, setIsFinished] = useState(false); // Kiểm tra đã hoàn thành quiz
  const [answered, setAnswered] = useState(false); // Kiểm tra câu hỏi đã được trả lời hay chưa

  // Tính điểm mỗi khi câu trả lời thay đổi
  const calculateScore = () => {
    let currentScore = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        currentScore++;
      }
    });
    setScore(currentScore);
  };

  // Xử lý thay đổi đáp án
  const handleAnswerChange = (e) => {
    const newAnswer = e.target.value;
    setAnswers(prev => {
      const updatedAnswers = [...prev];
      updatedAnswers[currentQuestionIndex] = newAnswer;
      return updatedAnswers;
    });

    // Kiểm tra câu trả lời đúng/sai
    if (newAnswer === quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    setAnswered(true);
  };

  // Chuyển câu hỏi sau 5 giây tự động
  useEffect(() => {
    if (answered) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnswered(false); // Reset trạng thái trả lời
        } else {
          setIsFinished(true); // Kết thúc quiz nếu đã trả lời hết các câu hỏi
        }
      }, 1000); // Chờ 5 giây trước khi chuyển câu hỏi

      return () => clearTimeout(timer); // Dọn dẹp timer khi component bị unmount hoặc câu hỏi đã thay đổi
    }
  }, [answered, currentQuestionIndex, quiz.questions.length]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer); // Dọn dẹp timer khi component bị unmount hoặc thời gian hết
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
    setIsFinished(false); // Reset trạng thái hoàn thành quiz
    setCurrentQuestionIndex(0); // Đặt lại câu hỏi đầu tiên
    setAnswers(Array(quiz.questions.length).fill(null)); // Reset các đáp án đã chọn
    setScore(0); // Reset điểm số
    setTimeLeft(60); // Reset thời gian còn lại
    setAnswered(false); // Reset trạng thái câu hỏi đã trả lời
  };
  

  // Hiển thị câu hỏi và các lựa chọn
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{quiz.description}</p>

      <div className="mb-4">
        <span className="font-semibold text-lg">Thời gian còn lại: </span>
        <span className="text-red-500">{timeLeft} giây</span>
      </div>

      {/* Hiển thị câu hỏi hiện tại */}
      <div className="question mb-6 p-4 border border-gray-300 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">{quiz.questions[currentQuestionIndex].question}</h3>

        <div className="grid grid-cols-2 gap-4">
          {quiz.questions[currentQuestionIndex].options.map((option, i) => (
            <label
              key={i}
              className={`flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer transition ${answered && (option === quiz.questions[currentQuestionIndex].correctAnswer ? 'bg-green-100' : 'bg-red-100')}`}
            >
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={answers[currentQuestionIndex] === option}
                onChange={handleAnswerChange}
                disabled={answered} // Không cho phép chọn lại khi câu hỏi đã được trả lời
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
          <p className="text-lg">Điểm của bạn là: {score}/{quiz.questions.length}</p>

          {/* Nút quay lại và chơi lại quiz */}
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