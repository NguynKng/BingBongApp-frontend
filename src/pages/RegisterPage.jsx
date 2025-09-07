import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaUser, FaPhone, FaEnvelope, FaBirthdayCake, FaLock, FaVenusMars } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi"; // Import icon mới từ React Icons

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { signup, isLoading, resetError } = useAuthStore();

    useEffect(() => {
        return () => resetError();
    }, [resetError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        if (currentYear - birthYear < 18) {
            toast.error("Bạn cần phải đủ 18 tuổi để đăng ký tài khoản!");
            return;
        }
        const dateOfBirth = `${birthDay}/${birthMonth}/${birthYear}`;
        const userData = {
            email,
            fullName,
            phoneNumber,
            dateOfBirth,
            password,
            gender: gender === "Nam" ? "Male" : gender === "Nữ" ? "Female" : "Other",
        };
        const success = await signup(userData);
        if (success) {
            navigate(`/verify-code?email=${email}&action=verifyAccount`);
        }
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
                Đăng ký
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Họ và tên và Giới tính */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="col-span-2 grid grid-cols-10 gap-6" // Chia thành 10 cột
                >
                    {/* Họ và tên (70%) */}
                    <div className="col-span-6">
                        <label className="flex items-center font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                            <FaUser className="mr-2 text-blue-500" /> {/* Icon Họ và tên */}
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
                            placeholder="Nhập họ và tên"
                        />
                    </div>

                    {/* Giới tính (30%) */}
                    <div className="col-span-4">
                        <label className="flex items-center font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                            <FaVenusMars className="mr-2 text-blue-500" /> {/* Icon Giới tính */}
                            Giới tính
                        </label>
                        <select
                            className="w-full px-4 py-2 rounded-lg bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                </motion.div>

                {/* Ngày sinh */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="col-span-2"
                >
                    <label className="flex items-center font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                        <FaBirthdayCake className="mr-2 text-blue-500" /> {/* Icon Ngày sinh */}
                        Ngày sinh
                    </label>
                    <div className="flex gap-2">
                        <select
                            className="w-1/3 px-4 py-2 rounded-lg bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            value={birthDay}
                            onChange={(e) => setBirthDay(e.target.value)}
                            required
                        >
                            <option value="">Ngày</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                        <select
                            className="w-1/3 px-4 py-2 rounded-lg bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            value={birthMonth}
                            onChange={(e) => setBirthMonth(e.target.value)}
                            required
                        >
                            <option value="">Tháng</option>
                            {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(
                                (m, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {m}
                                    </option>
                                )
                            )}
                        </select>
                        <select
                            className="w-1/3 px-4 py-2 rounded-lg bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                            value={birthYear}
                            onChange={(e) => setBirthYear(e.target.value)}
                            required
                        >
                            <option value="">Năm</option>
                            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Email */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-2"
                >
                    <label className="flex items-center font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                        <FaEnvelope className="mr-2 text-blue-500" /> {/* Icon Email */}
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
                        placeholder="Nhập email của bạn"
                    />
                </motion.div>

                {/* Số điện thoại và Mật khẩu */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-2 grid grid-cols-10 gap-6" // Chia thành 10 cột
                >
                    {/* Số điện thoại (50%) */}
                    <div className="col-span-5">
                        <label className="flex items-center font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                            <FaPhone className="mr-2 text-blue-500" /> {/* Icon Số điện thoại */}
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    {/* Mật khẩu (50%) */}
                    <div className="col-span-5">
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
                                {showPassword ? <HiEyeOff /> : <HiEye />} {/* Icon hiển thị/ẩn mật khẩu */}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Nút đăng ký */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="col-span-2 mt-4"
                >
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-60 text-lg tracking-wide"
                    >
                        {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                </motion.div>
            </form>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center"
            >
                <span className="text-gray-600 text-base">Đã có tài khoản?</span>
                <Link
                    to="/login"
                    className="ml-2 text-blue-700 hover:underline font-semibold cursor-pointer text-base"
                >
                    Đăng nhập
                </Link>
            </motion.div>
        </motion.div>
    );
}
