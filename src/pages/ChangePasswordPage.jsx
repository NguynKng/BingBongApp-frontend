import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle } from "react-icons/fa";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const handleReset = async () => {
    if (!password || !confirm) return toast.error("Please fill in all fields");
    if (password !== confirm) return toast.error("Passwords do not match");
    if (password.length < 6)
      return toast.error("Password is too short (minimum 6 characters)");

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(email, password);

      if (res.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Password reset failed");
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
      <div className="flex flex-col items-center gap-6 bg-white/50 backdrop-blur-md rounded-2xl py-8 px-10 w-[26rem] shadow-2xl border border-gray-200">
        
        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaLock className="text-blue-500" />
          Reset Password
        </h1>

        <p className="text-sm text-center text-gray-500">
          Enter your new password below to reset your account.
        </p>

        {/* New Password */}
        <div className="relative w-full">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 text-sm border-2 border-gray-300 rounded-lg shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                      transition-all duration-300 placeholder-gray-400"
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative w-full">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full py-3 px-4 text-sm border-2 border-gray-300 rounded-lg shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                      transition-all duration-300 placeholder-gray-400"
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FaCheckCircle />
              Confirm
            </>
          )}
        </button>
      </div>
    </div>
  );
}
