import { Lock, UserRound } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { adminLogin, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminLogin({ email, password });
  };

  return (
    <>
      <div className="flex items-center justify-center bg-gray-200 min-h-screen p-4">
        <div className="bg-white rounded-md py-4 px-6 w-[26rem] mt-4">
          <h1 className="text-center text-3xl font-medium">ADMIN LOGIN</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
            <div className="relative bg-gray-200 rounded-md p-2">
              <UserRound className="absolute right-0 top-0 transform -translate-x-3 translate-y-2/3 size-6 " />
              <input
                type="text"
                className="peer pt-4 pl-2 size-full pr-10 bg-transparent focus:outline-none"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label
                htmlFor="email"
                className={`absolute left-4 transition-all duration-300 font-medium text-gray-400  ${
                  email
                    ? "text-xs top-2"
                    : "top-3.5 peer-focus:text-xs peer-focus:top-2"
                }`}
              >
                Email
              </label>
            </div>
            <div className="relative bg-gray-200 rounded-md p-2">
              <Lock className="absolute right-0 top-0 transform -translate-x-3 translate-y-2/3 size-6" />
              <input
                type="password"
                className="peer pt-4 pl-2 size-full pr-10 bg-transparent focus:outline-none"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="password"
                className={`absolute left-4 transition-all duration-300 font-medium text-gray-400 ${
                  password
                    ? "text-xs top-2"
                    : "top-3.5 peer-focus:text-xs peer-focus:top-2"
                }`}
              >
                Password
              </label>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" className="cursor-pointer" />
              <label className="text-md">Remember Me</label>
            </div>
            <button className="text-white bg-orange-400 cursor-pointer rounded-md py-2 px-4 hover:opacity-90" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</button>
            <Link
              className="text-blue-500 hover:underline hover:underline-offset-2"
              to="/"
            >{`<- Back to Home`}</Link>
          </form>
        </div>
      </div>
    </>
  );
}
