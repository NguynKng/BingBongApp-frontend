import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiEye, HiEyeOff } from "react-icons/hi";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";
import Meta from "../components/Meta";
import { validateEmail } from "../utils/validate";

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
  const { signup, isSigningUp: isLoading, resetError } = useAuthStore();

  useEffect(() => { 
    return () => resetError();
  }, [resetError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
        toast.error("Please enter a valid email address.");
    }
    const currentYear = new Date().getFullYear();

    if (currentYear - birthYear < 18) {
      toast.error("You must be at least 18 years old to register an account!");
      return;
    }

    const dateOfBirth = `${birthDay}/${birthMonth}/${birthYear}`;
    const userData = {
      email,
      fullName,
      phoneNumber,
      dateOfBirth,
      password,
      gender:
        gender === "Male" ? "Male" : gender === "Female" ? "Female" : "Other",
    };

    const success = await signup(userData);
    if (success) {
      navigate(`/verify-code?email=${email}&action=verifyAccount`);
    }
  };

  return (
    <>
      <Meta title="Register" />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.4 }}
        className="w-full px-8 py-4 relative"
      >
        <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-y-6">
          {/* Full Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="col-span-2 relative"
          >
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-10 px-4 py-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
                placeholder="Full name"
              />
            </div>
          </motion.div>

          {/* Date of Birth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-2"
          >
            <div className="flex gap-2">
              <select
                className="w-1/3 px-4 py-2 rounded-lg bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                required
              >
                <option value="">Day</option>
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
                <option value="">Month</option>
                {[
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
                ].map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                className="w-1/3 px-4 py-2 rounded-lg bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                required
              >
                <option value="">Year</option>
                {Array.from(
                  { length: 100 },
                  (_, i) => new Date().getFullYear() - i
                ).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Phone Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 relative"
          >
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full pl-10 px-4 py-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
                placeholder="Phone number"
              />
            </div>
          </motion.div>

          {/* Gender */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="col-span-2"
          >
            <select
              className="w-full px-4 py-2 rounded-lg bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 relative"
          >
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 px-4 py-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
                placeholder="Email"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="col-span-2 relative"
          >
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 px-4 py-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-gray-400"
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
          </motion.div>

          {/* Register Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="col-span-2"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-60 text-lg tracking-wide"
            >
              {isLoading ? "Processing..." : "Register"}
            </button>
          </motion.div>
        </form>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <span className="text-gray-600 text-base">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="ml-2 text-blue-700 hover:underline font-semibold cursor-pointer text-base"
          >
            Login
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
