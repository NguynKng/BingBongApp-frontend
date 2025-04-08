import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();
    const { login, isLoading, isAuthenticated, resetError } = useAuthStore();

    // If already authenticated, redirect to home
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
        
        // Reset error when component unmounts
        return () => resetError();
    }, [isAuthenticated, navigate, resetError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login({ email, password });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="flex bg-gray-900 rounded-lg shadow-lg overflow-hidden w-[52rem]">
                {/* Left Side - Logo & Image */}
                <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-l from-indigo-500 to-purple-600 text-white p-10">
                    <img src="/images/ico/logo.ico" alt="Logo" className="w-40 h-40 mb-6" />
                    <h2 className="text-2xl font-bold mt-2">Welcome!</h2>
                    <p className="text-center mt-3 text-gray-200 text-lg w-3/4">
                    Tham gia ngay để kết nối với cộng đồng đam mê công nghệ!
                    </p>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full md:w-1/2 p-8 bg-gray-900 rounded-r-lg">
                    <h2 className="text-2xl font-bold text-center text-white mb-6">Đăng nhập</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mt-2"
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
                                className="w-full px-4 py-2 border rounded-lg mt-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                        </button>
                    </form>
                    <p className="text-center text-gray-400 text-sm mt-4">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="text-purple-400 hover:text-purple-300">
                        Đăng ký
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}