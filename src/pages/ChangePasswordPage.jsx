import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Thêm trạng thái hiển thị mật khẩu
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const handleReset = async () => {
    if (!password || !confirm) return toast.error("Please fill in all fields");
    if (password !== confirm) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Password too short");

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(email, password);

      if (res.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Reset failed");
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
          Enter your new password below to reset your account.
        </p>

        {/* Input New Password */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"} // Hiển thị hoặc ẩn mật khẩu
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 text-sm border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-gray-400"
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)} // Chuyển đổi trạng thái hiển thị mật khẩu
          >
            {showPassword ? "🙈" : "👁️"} {/* Icon hiển thị hoặc ẩn */}
          </span>
        </div>

        {/* Input Confirm Password */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"} // Hiển thị hoặc ẩn mật khẩu
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full py-3 px-4 text-sm border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-gray-400"
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)} // Chuyển đổi trạng thái hiển thị mật khẩu
          >
            {showPassword ? "🙈" : "👁️"} {/* Icon hiển thị hoặc ẩn */}
          </span>
        </div>

        {/* Nút Confirm */}
        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
