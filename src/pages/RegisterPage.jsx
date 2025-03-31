import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu có khớp không
        if (password !== confirmPassword) {
            setMessage("❌ Mật khẩu không khớp!");
            return;
        }

        console.log("Đăng ký với Email:", email, "Mật khẩu:", password);

        // Đăng ký thành công
        setMessage("✅ Đăng ký thành công! Chuyển sang đăng nhập...");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="flex bg-gray-900 rounded-lg shadow-lg overflow-hidden w-[52rem]">
                
                {/* Left Side - Welcome Image & Logo */}
                <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
                    <img src="/images/ico/logo.ico" alt="Logo" className="w-40 h-40 mb-6" />
                    <h2 className="text-2xl font-bold">Welcome!</h2>
                    <p className="text-center mt-2 text-lg">Chỉ mất vài giây để bắt đầu hành trình khám phá cùng chúng tôi!</p>
                </div>

                {/* Right Side - Register Form */}
                <div className="w-full md:w-1/2 p-8 bg-gray-900">
                    <h2 className="text-2xl font-bold text-center text-white mb-6">Đăng ký</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg mt-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                                className="w-full px-4 py-2 border rounded-lg mt-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>
                        <div className="h-6">
                            {message && (
                                <p className="text-green-400 text-center font-semibold">{message}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer"
                            >
                            Đăng ký
                        </button>
                    </form>
                    <p className="text-center text-gray-400 text-sm mt-4">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-purple-400 hover:underline">
                        Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
