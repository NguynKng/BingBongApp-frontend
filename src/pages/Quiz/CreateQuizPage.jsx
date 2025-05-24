import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizAPI } from "../../services/api";
import quizTopics from "../../data/quizTopic";

function CreateQuizPage() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    topics: [],
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

  const handleTopicChange = (e) => {
    const { value, checked } = e.target;
    setQuiz((prevQuiz) => {
      const updatedTopics = checked
        ? [...prevQuiz.topics, value]
        : prevQuiz.topics.filter((topic) => topic !== value);
      return {
        ...prevQuiz,
        topics: updatedTopics,
      };
    });
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
    <div className="min-h-screen bg-gradient-to-tr from-indigo-300 to-purple-400 dark:from-[#23233b] dark:to-[#181826] dark:bg-[#181826] overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/30 dark:bg-[#23233b]/80 backdrop-blur-md rounded-xl p-6 sm:p-10 shadow-2xl">
          {/* Nút back */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-white/20 dark:bg-white/10 text-white font-semibold shadow-md hover:bg-white/40 dark:hover:bg-white/20 transition duration-300"
          >
            <svg
              className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Quay lại</span>
          </button>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-white dark:text-white mb-8 drop-shadow">
            Tạo Quiz Mới
          </h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Tiêu đề */}
            <div>
              <label
                htmlFor="title"
                className="block text-lg sm:text-xl font-bold text-white mb-2"
              >
                🎯 Tiêu đề Quiz
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={quiz.title}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border border-gray-300 text-black text-base sm:text-lg dark:text-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
                placeholder="Nhập tiêu đề quiz"
                required
              />
            </div>
            {/* Chủ đề */}
            <div>
              <label className="block text-lg sm:text-xl font-bold text-white mb-2">
                🧩 Chủ đề liên quan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quizTopics.map((topic) => (
                  <label
                    key={topic.id}
                    className="inline-flex items-center gap-2 text-white"
                  >
                    <input
                      type="checkbox"
                      value={topic.name}
                      checked={quiz.topics.includes(topic.name)}
                      onChange={handleTopicChange}
                      className="form-checkbox h-5 w-5 text-yellow-400 border-gray-300 focus:ring-yellow-400 cursor-pointer"
                    />
                    {topic.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label
                htmlFor="description"
                className="block text-lg sm:text-xl font-bold text-white mb-2"
              >
                📝 Mô tả Quiz
              </label>
              <textarea
                id="description"
                name="description"
                value={quiz.description}
                onChange={handleInputChange}
                className="w-full p-4 rounded-lg border border-gray-300 text-black text-base sm:text-lg dark:text-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
                placeholder="Nhập mô tả quiz"
                rows="4"
              />
            </div>

            {/* Câu hỏi */}
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-200 dark:text-yellow-300">
                📚 Câu hỏi:
              </h2>
              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-white/10 p-6 rounded-xl shadow-lg space-y-4"
                >
                  {/* Câu hỏi */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-1">
                      Câu hỏi {index + 1}:
                    </label>
                    <textarea
                      name="question"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, e)}
                      rows="3"
                      className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#2b2b3d] text-black dark:text-white bg-white dark:bg-[#23233b] focus:outline-none focus:ring-4 focus:ring-pink-300"
                      placeholder="Nhập nội dung câu hỏi"
                      required
                    />
                  </div>

                  {/* Các đáp án */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-1">
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
                          className="w-full p-3 rounded-lg border border-gray-300 dark:border-[#2b2b3d] text-black dark:text-white bg-white dark:bg-[#23233b] focus:outline-none focus:ring-4 focus:ring-pink-300"
                          placeholder={`Đáp án ${i + 1}`}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  {/* Đáp án đúng */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-1">
                      ✅ Đáp án đúng:
                    </label>
                    <select
                      name="correctAnswer"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="w-full p-3 rounded-lg border border-gray-300 text-black dark:text-white focus:outline-none focus:ring-4 focus:ring-pink-300"
                      placeholder="Nhập đáp án đúng"
                      required
                    >
                      <option className="text-black" value="">
                        -- Chọn đáp án đúng --
                      </option>
                      {question.options.map((opt, i) => (
                        <option className="text-black" key={i} value={opt}>
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
                  className="px-6 py-3 bg-white/30 dark:bg-white/10 text-white font-semibold rounded-lg shadow-lg backdrop-blur hover:bg-white/50 dark:hover:bg-white/20 transition"
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
