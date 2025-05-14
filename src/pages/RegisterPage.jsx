import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Thêm state showPassword

    const navigate = useNavigate();
    const { signup, isLoading, resetError } = useAuthStore();

    useEffect(() => {
        return () => resetError();
    }, [resetError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dateOfBirth = `${birthDay}/${birthMonth}/${birthYear}`;
        const userData = {
            email,
            fullName,
            phoneNumber,
            dateOfBirth,
            password,
            gender: gender === "Nam" ? "Male" : gender === "Nữ" ? "Female" : "Other"
        };
        await signup(userData);
        navigate("/login");
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

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f0f4f8] via-[#dfe9f3] to-[#ffffff]">
                <div
                    className="flex bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden w-[60rem]"
                    style={fadeInUpStyle}
                >
                    {/* Left Side */}
                    <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-tr from-[#a18cd1] to-[#fbc2eb] text-white p-10 relative">
                        <img
                            src="/images/ico/logo.ico"
                            alt="Logo"
                            className="w-32 h-32 mb-6 drop-shadow-lg hover:scale-110 transition-transform duration-300"
                        />
                        <h2 className="text-3xl font-bold">Chào mừng!</h2>
                        <p className="text-center mt-4 text-white text-lg w-3/4 leading-relaxed">
                            Chỉ mất vài giây để bắt đầu hành trình khám phá cùng chúng tôi!
                        </p>
                        <div className="absolute bottom-6 text-sm text-white opacity-80">
                            🚀 Công nghệ mở rộng tương lai
                        </div>
                    </div>

                    {/* Right Side - Register Form */}
                    <div className="w-full md:w-1/2 p-10 bg-white text-gray-800 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-wide">Đăng ký</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    placeholder="Họ tên"
                                />
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    placeholder="Số điện thoại"
                                />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Email"
                            />
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Ngày sinh</label>
                                <div className="flex gap-2">
                                    <select
                                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800"
                                        value={birthDay}
                                        onChange={(e) => setBirthDay(e.target.value)}
                                        required
                                    >
                                        <option value="">Ngày</option>
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800"
                                        value={birthMonth}
                                        onChange={(e) => setBirthMonth(e.target.value)}
                                        required
                                    >
                                        <option value="">Tháng</option>
                                        {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m, i) => (
                                            <option key={i + 1} value={i + 1}>{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800"
                                        value={birthYear}
                                        onChange={(e) => setBirthYear(e.target.value)}
                                        required
                                    >
                                        <option value="">Năm</option>
                                        {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} // Thay đổi giữa 'password' và 'text'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    placeholder="Mật khẩu"
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)} // Thay đổi trạng thái showPassword
                                >
                                    {showPassword ? (
                                        <span className="text-gray-600">🙈</span> // Biểu tượng mắt đóng
                                    ) : (
                                        <span className="text-gray-600">👁️</span> // Biểu tượng mắt mở
                                    )}
                                </span>
                            </div>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-800"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="">Giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 rounded-xl text-white font-bold tracking-wide transition-transform duration-300 transform hover:scale-105 focus:scale-95 ${
                                    isLoading
                                        ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg"
                                }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 rounded-full bg-white animate-ping"></div>
                                        <span>Đang xử lý...</span>
                                    </div>
                                ) : (
                                    "Đăng ký"
                                )}
                            </button>
                        </form>
                        <p className="text-center text-gray-600 text-sm mt-6">
                            Đã có tài khoản?{" "}
                            <Link
                                to="/login"
                                className="text-purple-500 hover:text-purple-400 underline underline-offset-2 transition-colors"
                            >
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
