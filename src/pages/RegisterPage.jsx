import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FaUser, FaPhone, FaEnvelope, FaLock } from "react-icons/fa";
import Meta from "../components/Meta";
import { validateEmail } from "../utils/validate";

const inputBase =
  "w-full px-4 py-3 rounded-lg border border-[#dde1ec] bg-[#fafbff] text-base text-gray-700 placeholder-gray-400 outline-none transition focus:border-[#5c6bc0] focus:ring-2 focus:ring-[#5c6bc0]/20";

const selectBase =
  "w-full px-3 py-3 rounded-lg border border-[#dde1ec] bg-[#fafbff] text-base text-gray-700 outline-none transition focus:border-[#5c6bc0] focus:ring-2 focus:ring-[#5c6bc0]/20";

const labelBase = "block text-sm font-semibold text-[#6b7a9d] mb-1.5 uppercase tracking-wider";

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
      return;
    }
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear < 18) {
      toast.error("You must be at least 18 years old to register!");
      return;
    }
    const dateOfBirth = `${birthDay}/${birthMonth}/${birthYear}`;
    const userData = {
      email,
      fullName,
      phoneNumber,
      dateOfBirth,
      password,
      gender: gender === "Male" ? "Male" : gender === "Female" ? "Female" : "Other",
    };
    const success = await signup(userData);
    if (success) {
      navigate(`/verify-code?email=${email}&action=verifyAccount`);
    }
  };

  return (
    <>
      <Meta title="Register" />

      <div className="w-full">
        <h2 className="text-3xl font-bold text-[#3b4a6b] mb-1">Create account</h2>
        <p className="text-base text-[#9aa3c2] mb-6">Join the BingBong community</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className={labelBase}>Full name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3c2] text-sm" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={inputBase + " pl-9"}
                placeholder="Your full name"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={labelBase}>Phone number</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3c2] text-sm" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className={inputBase + " pl-9"}
                placeholder="0901 234 567"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelBase}>Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3c2] text-sm" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputBase + " pl-9"}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelBase}>Date of birth</label>
            <div className="flex gap-2">
              <select
                className={selectBase}
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                required
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                className={selectBase}
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                required
              >
                <option value="">Month</option>
                {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                className={selectBase}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                required
              >
                <option value="">Year</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className={labelBase}>Gender</label>
            <select
              className={selectBase}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className={labelBase}>Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3c2] text-sm" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputBase + " pl-9 pr-10"}
                placeholder="••••••••"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa3c2] cursor-pointer hover:text-[#5c6bc0] transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#5c6bc0] hover:bg-[#4a58a8] text-white text-base font-semibold transition disabled:opacity-50 cursor-pointer mt-1"
          >
            {isLoading ? "Creating account…" : "Create account"}
          </button>
        </form>

        {/* Mobile login link */}
        <p className="mt-5 text-center text-base text-[#9aa3c2] md:hidden">
          Already have an account?{" "}
          <Link to="/login" className="text-[#5c6bc0] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
