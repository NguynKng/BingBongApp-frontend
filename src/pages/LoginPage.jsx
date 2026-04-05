import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import Meta from "../components/Meta";

const inputBase =
  "w-full px-4 py-3 rounded-lg border border-[#dde1ec] bg-[#fafbff] text-base text-gray-700 placeholder-gray-400 outline-none transition focus:border-[#5c6bc0] focus:ring-2 focus:ring-[#5c6bc0]/20";

const labelBase = "block text-sm font-semibold text-[#6b7a9d] mb-1.5 uppercase tracking-wider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn: isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  const handleGoogleLogin = () => {
    toast.dismiss();
    toast("Google login is under development!", { icon: "🚧" });
  };

  const handleGithubLogin = () => {
    toast.dismiss();
    toast("GitHub login is under development!", { icon: "🚧" });
  };

  return (
    <>
      <Meta title="Login" />

      <div className="w-full">
        <h2 className="text-3xl font-bold text-[#3b4a6b] mb-1">Welcome back</h2>
        <p className="text-base text-[#9aa3c2] mb-7">Sign in to your BingBong account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelBase} style={{ marginBottom: 0 }}>Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-[#5c6bc0] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#5c6bc0] hover:bg-[#4a58a8] text-white text-base font-semibold transition disabled:opacity-50 cursor-pointer mt-2"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#eaecf4]" />
          <span className="text-sm text-[#b0b8d1]">or continue with</span>
          <div className="flex-1 h-px bg-[#eaecf4]" />
        </div>

        {/* Social */}
        <div className="flex gap-3">
          <button
            onClick={handleGoogleLogin}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#dde1ec] bg-white hover:bg-[#f5f6fa] text-base text-gray-600 font-medium transition cursor-pointer"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Google
          </button>
          <button
            onClick={handleGithubLogin}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#dde1ec] bg-white hover:bg-[#f5f6fa] text-base text-gray-600 font-medium transition cursor-pointer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
              alt="GitHub"
              className="w-5 h-5"
            />
            GitHub
          </button>
        </div>

        {/* Mobile register link */}
        <p className="mt-6 text-center text-base text-[#9aa3c2] md:hidden">
          New to BingBong?{" "}
          <Link to="/register" className="text-[#5c6bc0] font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </>
  );
}
