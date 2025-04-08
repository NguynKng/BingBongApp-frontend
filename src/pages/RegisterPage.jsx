import { useState } from "react";
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
    const navigate = useNavigate();
    
    const { signup, isLoading, resetError } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Format date of birth as day/month/year
        const dateOfBirth = `${birthDay}/${birthMonth}/${birthYear}`;
        
        // Create user data object
        const userData = {
            email,
            fullName,
            phoneNumber,
            dateOfBirth,
            password,
            gender: gender ==="Nam" ? "Male" : gender==="Nữ" ? "Female" : "Other"
        };
        await signup(userData);
        navigate("/login")
    };

    // Reset error when component unmounts
    useState(() => {
        return () => resetError();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800">
            <div className="flex bg-gray-900 rounded-lg shadow-lg overflow-hidden w-[70rem]">
                
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
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-1/2 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                autoFocus
                                placeholder="Tên"
                            />
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                className="w-1/2 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Số điện thoại"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">
                                <label className="text-xs text-gray-500">Date of birth</label>
                                <div className="flex items-center justify-center rounded-full bg-gray-500 size-4 cursor-pointer">
                                    <span className="text-xs text-white">?</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select 
                                    className="w-1/3 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    value={birthDay}
                                    onChange={(e) => setBirthDay(e.target.value)}
                                    required
                                >
                                    <option value="">Day</option>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                                <select 
                                    className="w-1/3 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    value={birthMonth}
                                    onChange={(e) => setBirthMonth(e.target.value)}
                                    required
                                >
                                    <option value="">Month</option>
                                    {[
                                        "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
                                    ].map((month, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {month}
                                    </option>
                                    ))}
                                </select>
                                <select 
                                    className="w-1/3 px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    value={birthYear}
                                    onChange={(e) => setBirthYear(e.target.value)}
                                    required
                                >
                                    <option value="">Year</option>
                                    {Array.from({ length: 121 }, (_, i) => 2023 - i).map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Gender */}
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-1">
                                <label className="text-xs text-gray-500">Gender</label>
                                <div className="flex items-center justify-center rounded-full bg-gray-500 size-4 cursor-pointer">
                                    <span className="text-xs text-white">?</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {["Nam", "Nữ", "Khác"].map((g) => (
                                <div
                                    key={g}
                                    className={`flex items-center justify-between gap-2 py-2 px-4 border rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-700 border-gray-500`}
                                >
                                    <label htmlFor={g} className="capitalize text-white">
                                    {g}
                                    </label>
                                    <input
                                        type="radio"
                                        id={g}
                                        name="gender"
                                        value={g}
                                        checked={gender === g}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="accent-blue-500"
                                    />
                                </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Email"
                            />
                        </div>
                        <div className="w-full">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                                placeholder="Mật khẩu"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xử lý..." : "Đăng ký"}
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
