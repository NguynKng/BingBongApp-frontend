import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Footer from "../components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  const fadeInUpStyle = {
    animation: "fadeInUp 0.8s ease-out",
  };

  const keyframes = `
        @keyframes fadeInUp {
            0% {
                opacity: 0;
                transform: translateY(40px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

  return (
    <>
      <style>{keyframes}</style>

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f0f4f8] via-[#dfe9f3] to-[#ffffff] px-4">
        <div
          className="flex flex-col md:flex-row bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl"
          style={fadeInUpStyle}
        >
          {/* Left Side */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-tr from-[#a18cd1] to-[#fbc2eb] text-white p-8">
            <img
              src="/images/ico/logo.ico"
              alt="Logo"
              className="w-24 h-24 mb-4 drop-shadow-lg hover:scale-110 transition-transform duration-300"
            />
            <h2 className="text-2xl font-bold">Welcome!</h2>
            <p className="text-center mt-4 text-white text-base leading-relaxed">
              Tham gia ngay để kết nối với cộng đồng đam mê công nghệ!
            </p>
            <div className="mt-6 text-sm text-white opacity-80">
              🚀 Công nghệ mở rộng tương lai
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-10 bg-white text-gray-800">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 tracking-wide">
              Đăng nhập
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner"
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span className="text-gray-600">🙈</span>
                    ) : (
                      <span className="text-gray-600">👁️</span>
                    )}
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl text-white font-bold tracking-wide transition-transform duration-300 transform hover:scale-105 focus:scale-95 ${
                  isLoading
                    ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg cursor-pointer"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-white animate-ping"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link
                to="/forgot-password"
                className="inline-block text-sm text-purple-600 hover:text-purple-500 hover:underline hover:underline-offset-4 transition-colors duration-200"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <p className="text-center text-gray-600 text-sm mt-6">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-purple-500 hover:text-purple-400 underline underline-offset-2 transition-colors"
              >
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
