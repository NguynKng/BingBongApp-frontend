import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizAPI } from "../../services/api";
function CreateQuizPage() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][name] = value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: updatedQuestions,
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    };
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [...prevQuiz.questions, newQuestion],
    }));
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: updatedQuestions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await quizAPI.createQuiz(quiz);
      console.log("Quiz đã tạo thành công:", response);
      navigate("/quiz");
    } catch (error) {
      console.error("Có lỗi khi tạo quiz:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-300 to-purple-400 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 sm:p-10 shadow-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white mb-8 drop-shadow">
            Tạo Quiz Mới
          </h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Tiêu đề */}
            <div>
              <label
                htmlFor="title"
                className="block text-lg sm:text-xl font-bold text-white mb-2"
              >
                🎯 Tiêu đề Quiz:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={quiz.title}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border border-gray-300 text-black text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
                placeholder="Nhập tiêu đề quiz"
                required
              />
            </div>

            {/* Mô tả */}
            <div>
              <label
                htmlFor="description"
                className="block text-lg sm:text-xl font-bold text-white mb-2"
              >
                📝 Mô tả Quiz:
              </label>
              <textarea
                id="description"
                name="description"
                value={quiz.description}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border border-gray-300 text-black text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
                placeholder="Nhập mô tả quiz"
                rows="4"
              />
            </div>

            {/* Câu hỏi */}
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-200">
                📚 Câu hỏi:
              </h2>
              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-white/70 p-6 rounded-xl shadow-lg space-y-4"
                >
                  {/* Câu hỏi */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-1">
                      Câu hỏi {index + 1}:
                    </label>
                    <input
                      type="text"
                      name="question"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-4 focus:ring-pink-300"
                      placeholder="Nhập câu hỏi"
                      required
                    />
                  </div>

                  {/* Các đáp án */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-1">
                      Đáp án:
                    </label>
                    <div className="space-y-2">
                      {question.options.map((option, i) => (
                        <input
                          key={i}
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[i] = e.target.value;
                            setQuiz((prevQuiz) => {
                              const updatedQuestions = [...prevQuiz.questions];
                              updatedQuestions[index].options = newOptions;
                              return {
                                ...prevQuiz,
                                questions: updatedQuestions,
                              };
                            });
                          }}
                          className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-4 focus:ring-pink-300"
                          placeholder={`Đáp án ${i + 1}`}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  {/* Đáp án đúng */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-1">
                      ✅ Đáp án đúng:
                    </label>
                    <select
                      name="correctAnswer"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-4 focus:ring-pink-300"
                      required
                    >
                      <option value="">-- Chọn đáp án đúng --</option>
                      {question.options.map((opt, i) => (
                        <option key={i} value={opt}>
                          Đáp án {i + 1}: {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nút xóa */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => deleteQuestion(index)}
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition"
                    >
                      ❌ Xóa câu hỏi
                    </button>
                  </div>
                </div>
              ))}

              {/* Nút thêm câu hỏi */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-6 py-3 bg-white/30 text-white font-semibold rounded-lg shadow-lg backdrop-blur hover:bg-white/50 transition"
                >
                  ➕ Thêm câu hỏi
                </button>
              </div>
            </div>

            {/* Nút tạo quiz */}
            <div>
              <button
                type="submit"
                className="w-full px-6 py-4 bg-green-500 text-white text-lg sm:text-xl font-semibold rounded-lg shadow-lg hover:bg-green-600 transition"
              >
                🚀 Tạo Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateQuizPage;
