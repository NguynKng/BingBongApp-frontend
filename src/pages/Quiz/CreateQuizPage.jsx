import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateQuizPage() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][name] = value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    const newQuestion = {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    };
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [...prevQuiz.questions, newQuestion]
    }));
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: updatedQuestions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/quiz", quiz, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 201) {
        console.log("Quiz đã tạo thành công:", response.data);
        navigate("/quiz");
      }
    } catch (error) {
      console.error("Có lỗi khi tạo quiz:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-tr from-indigo-300 to-purple-400 text-white rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
      <h1 className="text-5xl font-extrabold text-center mb-10 drop-shadow-md">Tạo Quiz Mới</h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Tiêu đề Quiz */}
        <div className="space-y-3">
          <label
            htmlFor="title"
            className="block text-xl font-bold transition transform hover:text-yellow-300 hover:scale-105"
          >
            🎯 Tiêu đề Quiz:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={quiz.title}
            onChange={handleInputChange}
            className="w-full p-4 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 transition"
            placeholder="Nhập tiêu đề quiz"
            required
          />
        </div>

        {/* Mô tả Quiz */}
        <div className="space-y-3">
          <label
            htmlFor="description"
            className="block text-xl font-bold transition transform hover:text-yellow-300 hover:scale-105"
          >
            📝 Mô tả Quiz:
          </label>
          <textarea
            id="description"
            name="description"
            value={quiz.description}
            onChange={handleInputChange}
            className="w-full p-4 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 transition"
            placeholder="Nhập mô tả quiz"
            rows="4"
          />
        </div>

        {/* Câu hỏi */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-yellow-200">📚 Câu hỏi:</h2>
          {quiz.questions.map((question, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 rounded-xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Câu hỏi */}
              <div className="space-y-2 mb-4">
                <label className="block text-xl font-semibold text-gray-900 transition hover:text-pink-500 hover:scale-105">
                  Câu hỏi {index + 1}:
                </label>
                <input
                  type="text"
                  name="question"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="w-full p-4 rounded-lg border border-gray-300 text-black text-lg focus:outline-none focus:ring-4 focus:ring-pink-300"
                  placeholder="Nhập câu hỏi"
                  required
                />
              </div>

              {/* Đáp án */}
              <div className="space-y-2 mb-4">
                <label className="block text-xl font-semibold text-gray-900 transition hover:text-pink-500 hover:scale-105">
                  Đáp án:
                </label>
                {question.options.map((option, i) => (
                  <div key={i} className="mb-2">
                    <input
                      type="text"
                      name="options"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[i] = e.target.value;
                        setQuiz((prevQuiz) => {
                          const updatedQuestions = [...prevQuiz.questions];
                          updatedQuestions[index].options = newOptions;
                          return { ...prevQuiz, questions: updatedQuestions };
                        });
                      }}
                      className="w-full p-4 rounded-lg border border-gray-300 text-black text-lg focus:outline-none focus:ring-4 focus:ring-pink-300"
                      placeholder={`Đáp án ${i + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Đáp án đúng */}
              <div className="space-y-2 mb-4">
                <label className="block text-xl font-semibold text-gray-900 transition hover:text-pink-500 hover:scale-105">
                  ✅ Đáp án đúng:
                </label>
                <input
                  type="text"
                  name="correctAnswer"
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="w-full p-4 rounded-lg border border-gray-300 text-black text-lg focus:outline-none focus:ring-4 focus:ring-pink-300"
                  placeholder="Nhập đáp án đúng"
                  required
                />
              </div>

              {/* Xóa câu hỏi */}
              <button
                type="button"
                onClick={() => deleteQuestion(index)}
                className="mt-2 px-6 py-2 bg-red-700 text-white rounded-lg shadow-md hover:bg-red-800 transition hover:scale-105"
              >
                ❌ Xóa câu hỏi
              </button>
            </div>
          ))}

          {/* Nút thêm câu hỏi */}
          <button
            type="button"
            onClick={addQuestion}
            className="px-6 py-3 bg-white/30 text-white font-bold rounded-lg shadow-lg backdrop-blur-md hover:bg-white/50 focus:outline-none transition transform hover:scale-105"
          >
            ➕ Thêm câu hỏi
          </button>
        </div>

        {/* Nút tạo quiz */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-green-500 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none transition transform hover:scale-105"
        >
          🚀 Tạo Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuizPage;
