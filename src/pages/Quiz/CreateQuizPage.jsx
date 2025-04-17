import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateQuizPage() {
  const navigate = useNavigate();

  // State để lưu trữ thông tin quiz
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: []
  });

  // Hàm cập nhật thông tin quiz
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      [name]: value
    }));
  };

  // Hàm cập nhật câu hỏi
  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][name] = value;
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: updatedQuestions
    }));
  };

  // Thêm câu hỏi mới
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

  // Xóa câu hỏi
  const deleteQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: updatedQuestions
    }));
  };

  // Hàm xử lý form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Gửi dữ liệu quiz lên backend hoặc lưu vào bộ nhớ
    // Ví dụ: Gửi lên localStorage, API backend, hoặc chỉ lưu trong state của app
    console.log("Quiz đã tạo:", quiz);

    // Chuyển hướng người dùng sau khi tạo quiz
    navigate("/quiz");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Tạo Quiz Mới</h1>

      <form onSubmit={handleSubmit}>
        {/* Tiêu đề Quiz */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700">Tiêu đề Quiz:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={quiz.title}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Mô tả Quiz */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-lg font-semibold text-gray-700">Mô tả Quiz:</label>
          <textarea
            id="description"
            name="description"
            value={quiz.description}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>

        {/* Câu hỏi */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Câu hỏi:</h2>
          {quiz.questions.map((question, index) => (
            <div key={index} className="p-4 mb-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
              {/* Câu hỏi */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-700">Câu hỏi {index + 1}:</label>
                <input
                  type="text"
                  name="question"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Đáp án */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-700">Đáp án:</label>
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
                      className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Đáp án đúng */}
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-700">Đáp án đúng:</label>
                <input
                  type="text"
                  name="correctAnswer"
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, e)}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Nút xóa câu hỏi */}
              <button
                type="button"
                onClick={() => deleteQuestion(index)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition duration-200"
              >
                Xóa câu hỏi
              </button>
            </div>
          ))}

          {/* Nút thêm câu hỏi */}
          <button
            type="button"
            onClick={addQuestion}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition duration-200"
          >
            Thêm câu hỏi
          </button>
        </div>

        {/* Nút tạo quiz */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition duration-200"
        >
          Tạo Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuizPage;