import { useState } from "react";

export default function LoginForm({ switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);

    // Giả lập đăng nhập thành công
    setSuccessMessage("🎉 Đăng nhập thành công!");

    // Xóa thông báo sau 3 giây
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="flex bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-4xl w-1/2">
        {/* Left Side - Logo & Image */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-l from-indigo-500 to-purple-600 text-white p-10">
          <img src="/images/ico/logo.ico" alt="Logo" className="w-40 h-40 mb-6" />
          <h2 className="text-3xl font-bold mt-2">Welcome!</h2>
          <p className="text-center mt-3 text-gray-200 text-lg w-3/4">
          Tham gia ngay để kết nối với cộng đồng đam mê công nghệ!
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 bg-gray-900 rounded-r-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Đăng nhập</h2>

          {/* Hiển thị thông báo đăng nhập thành công */}
          {successMessage && (
            <p className="text-green-400 text-center font-semibold">{successMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-gray-400">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Đăng nhập
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Chưa có tài khoản?{" "}
            <button onClick={switchToRegister} className="text-purple-400 hover:text-purple-300">
              Đăng ký
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
