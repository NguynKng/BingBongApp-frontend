import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      if (res.success) {
        navigate(`/verify-code?email=${email}&action=resetPassword`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-4">
      <div className="flex flex-col items-center gap-6 bg-white rounded-2xl py-8 px-10 w-[26rem] shadow-2xl border border-gray-200">
        {/* Tiêu đề */}
        <h1 className="text-center text-2xl font-bold text-blue-700">
          Reset Your Password
        </h1>
        <p className="text-sm text-center text-gray-500">
          Enter your email address below and we’ll send you a link to reset your
          password.
        </p>

        {/* Input Email */}
        <div className="relative w-full">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-4 text-sm border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-gray-400"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="fas fa-envelope"></i>
          </span>
        </div>

        {/* Nút Submit */}
        <button
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Submit"}
        </button>

        {/* Gợi ý */}
        <p className="text-sm text-gray-500 text-center">
          Remembered your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
