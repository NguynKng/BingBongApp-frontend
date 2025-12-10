import { Lock, UserRound, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import logo from "/images/ico/logo_bingbong.ico";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn: isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password }, { admin: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl py-8 px-8 w-[26rem] mt-4 flex flex-col items-center border border-gray-200">
        <img
          src={logo}
          alt="Logo"
          className="w-28 h-28 object-contain mb-4 drop-shadow-lg"
        />
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-2 tracking-wide">
          ADMIN LOGIN
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-2">
          <div className="relative bg-gray-50 rounded-lg p-2 border border-gray-200">
            <UserRound className="absolute right-0 top-0 transform -translate-x-3 translate-y-2/3 size-6 text-gray-500" />
            <input
              type="text"
              className="peer pt-4 pl-2 size-full pr-10 bg-transparent focus:outline-none text-gray-900"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
            <label
              htmlFor="email"
              className={`absolute left-4 transition-all duration-300 font-medium text-gray-500 ${
                email
                  ? "text-xs top-2"
                  : "top-3.5 peer-focus:text-xs peer-focus:top-2"
              }`}
            >
              Email
            </label>
          </div>
          <div className="relative bg-gray-50 rounded-lg p-2 border border-gray-200">
            <Lock className="absolute right-0 top-0 transform -translate-x-3 translate-y-2/3 size-6 text-gray-500" />
            <input
              type="password"
              className="peer pt-4 pl-2 size-full pr-10 bg-transparent focus:outline-none text-gray-900"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <label
              htmlFor="password"
              className={`absolute left-4 transition-all duration-300 font-medium text-gray-500 ${
                password
                  ? "text-xs top-2"
                  : "top-3.5 peer-focus:text-xs peer-focus:top-2"
              }`}
            >
              Password
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="cursor-pointer accent-blue-500"
              id="remember"
            />
            <label htmlFor="remember" className="text-md text-gray-700">
              Remember Me
            </label>
          </div>
          <button
            className="text-white bg-gradient-to-r from-blue-500 to-blue-600 cursor-pointer rounded-lg py-2 px-4 font-semibold shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <Link
            to="/"
            className="mt-2 inline-flex items-center justify-center gap-2 text-blue-600 border-2 border-blue-500 bg-white rounded-lg py-2 px-4 font-bold shadow hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg transition-all duration-200 text-center"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </form>
      </div>
    </div>
  );
}