import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  const handleGoogleLogin = () => {
    toast.dismiss(); // Xóa thông báo cũ
    toast("Tính năng Google đang được phát triển!", { icon: "🚧" });
  };

  const handleGithubLogin = () => {
    toast.dismiss(); // Xóa thông báo cũ
    toast("Tính năng GitHub đang được phát triển!", { icon: "🚧" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
      className="w-full px-8 py-4 relative"
    >

      <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow">
        Đăng nhập
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="col-span-2"
        >
          <label className="flex items-center font-semibold text-gray-700 mb-2 text-lg tracking-wide">
            <FaEnvelope className="mr-2 text-blue-500" /> {/* Icon Email */}
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
              placeholder="Nhập email của bạn"
            />
          </div>
        </motion.div>

        {/* Mật khẩu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2"
        >
          <label className="flex items-center font-semibold text-gray-700 mb-2 text-lg tracking-wide">
            <FaLock className="mr-2 text-blue-500" /> {/* Icon Mật khẩu */}
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
              placeholder="Nhập mật khẩu"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Thay đổi icon */}
            </span>
          </div>
          {/* Quên mật khẩu */}
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </motion.div>

        {/* Nút đăng nhập */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-2"
        >
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-60 text-lg tracking-wide"
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </motion.div>
      </form>

      {/* Ngăn cách */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center my-6"
      >
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">Hoặc</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </motion.div>

      {/* Đăng nhập bằng Google và GitHub */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col gap-4"
      >
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-md transition-all duration-300 border border-gray-300"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Đăng nhập bằng Google
        </button>
        <button
          onClick={handleGithubLogin}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
            alt="GitHub Logo"
            className="w-5 h-5"
          />
          Đăng nhập bằng GitHub
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-600 text-base">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="ml-2 text-blue-700 hover:underline font-semibold cursor-pointer text-base">
            Đăng ký
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}