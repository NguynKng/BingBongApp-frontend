import { useState } from "react";

export default function RegisterForm({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu có khớp không
    if (password !== confirmPassword) {
      setErrorMessage("❌ Mật khẩu không khớp!");
      setSuccessMessage(""); // Xóa thông báo thành công nếu có
      return;
    }

    console.log("Đăng ký với Email:", email, "Mật khẩu:", password);

    // Đăng ký thành công
    setSuccessMessage("✅ Đăng ký thành công! Chuyển sang đăng nhập...");
    setErrorMessage(""); // Xóa thông báo lỗi nếu có

    setTimeout(() => {
      switchToLogin();
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl w-1/2">
        
        {/* Left Side - Welcome Image & Logo */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
          <img src="/images/ico/logo.ico" alt="Logo" className="w-40 h-40 mb-6" />
          <h2 className="text-2xl font-bold">Welcome!</h2>
          <p className="text-center mt-2">Chỉ mất vài giây để bắt đầu hành trình khám phá cùng chúng tôi!</p>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Đăng ký</h2>
          
          {/* Hiển thị thông báo lỗi hoặc thành công */}
          {errorMessage && (
            <p className="text-red-500 text-center font-semibold">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-400 text-center font-semibold">{successMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-gray-300">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-gray-300">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Đăng ký
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Đã có tài khoản?{" "}
            <button onClick={switchToLogin} className="text-purple-400 hover:underline">
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
