import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import {
  FaKey,
  FaInfoCircle,
  FaEnvelope,
  FaSpinner,
  FaPaperPlane,
  FaQuestionCircle,
} from "react-icons/fa";
import { validateEmail } from "../utils/validate";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) return;
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

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
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/public/background-gradient.webp')",
      }}
    >
      <div className="flex flex-col items-center gap-6 bg-white/50 backdrop-blur-md rounded-2xl py-8 px-10 w-[26rem] shadow-2xl border border-gray-300">
        {/* Title */}
        <h1 className="text-center text-3xl font-extrabold text-blue-700 flex items-center gap-3">
          <FaKey className="text-blue-500" />
          Reset Password
        </h1>

        <p className="text-sm text-center text-gray-600 leading-relaxed">
          <FaInfoCircle className="text-gray-400 mr-1 inline" />
          Enter your email address below and we’ll send you a link to reset your
          password.
        </p>

        {/* Email Field */}
        <div className="relative w-full">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-4 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaEnvelope />
          </span>
        </div>

        {/* Submit Button */}
        <button
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } flex items-center justify-center gap-2`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Send
            </>
          )}
        </button>

        {/* Suggestion */}
        <p className="text-sm text-gray-600 text-center">
          <FaQuestionCircle className="text-gray-400 mr-1 inline" />
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
