import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle } from "react-icons/fa";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // Trạng thái hiển thị mật khẩu mới
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Trạng thái hiển thị xác nhận mật khẩu
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const handleReset = async () => {
    if (!password || !confirm) return toast.error("Vui lòng điền đầy đủ thông tin");
    if (password !== confirm) return toast.error("Mật khẩu không khớp");
    if (password.length < 6) return toast.error("Mật khẩu quá ngắn (tối thiểu 6 ký tự)");

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(email, password);

      if (res.success) {
        toast.success("Đặt lại mật khẩu thành công!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Đặt lại thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/public/background-gradient.webp')", // Thay đường dẫn bằng đường dẫn đến hình ảnh của bạn
      }}
    >
      <div className="flex flex-col items-center gap-6 bg-white/50 backdrop-blur-md rounded-2xl py-8 px-10 w-[26rem] shadow-2xl border border-gray-200">
        {/* Tiêu đề */}
        <h1 className="text-center text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaLock className="text-blue-500" /> {/* Icon khóa */}
          Đặt lại mật khẩu
        </h1>
        <p className="text-sm text-center text-gray-500">
          Nhập mật khẩu mới của bạn bên dưới để đặt lại tài khoản.
        </p>

        {/* Input New Password */}
        <div className="relative w-full">
          <input
            type={showNewPassword ? "text" : "password"} // Hiển thị hoặc ẩn mật khẩu
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 text-sm border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-gray-400"
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowNewPassword(!showNewPassword)} // Chuyển đổi trạng thái hiển thị mật khẩu mới
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />} {/* Icon hiển thị hoặc ẩn */}
          </span>
        </div>

        {/* Input Confirm Password */}
        <div className="relative w-full">
          <input
            type={showConfirmPassword ? "text" : "password"} // Hiển thị hoặc ẩn mật khẩu
            placeholder="Xác nhận mật khẩu"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full py-3 px-4 text-sm border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 placeholder-gray-400"
          />
          <span
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Chuyển đổi trạng thái hiển thị xác nhận mật khẩu
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Icon hiển thị hoặc ẩn */}
          </span>
        </div>

        {/* Nút Confirm */}
        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300 ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            } flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> {/* Icon loading */}
              Đang xử lý...
            </>
          ) : (
            <>
              <FaCheckCircle /> {/* Icon xác nhận */}
              Xác nhận
            </>
          )}
        </button>
      </div>
    </div>
  );
}
