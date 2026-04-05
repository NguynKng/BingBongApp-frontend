import React from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

export default function AuthContainer() {
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  return (
    <div
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
      className="flex items-center justify-center w-full min-h-screen bg-[#f5f6fa]"
    >
      <div className="flex w-full max-w-4xl min-h-[600px] rounded-2xl shadow-lg overflow-hidden bg-white">
        {/* Left panel – branding */}
        <div className="hidden md:flex flex-col items-center justify-center w-5/12 bg-[#eef2ff] px-10 py-12 relative">
          <img
            src="./images/ico/logo_bingbong.ico"
            alt="BingBong Logo"
            style={{ width: 96, height: 96, objectFit: "contain" }}
            className="mb-6 rounded-2xl shadow-sm"
          />
          <h2 className="text-2xl font-bold text-[#3b4a6b] mb-2 tracking-tight">
            BingBong
          </h2>
          <p className="text-sm text-[#6b7a9d] text-center leading-relaxed">
            The social network of emotions —{" "}
            <span className="font-semibold text-[#5c6bc0]">your rhythm, your vibe.</span>
          </p>

          <div className="absolute bottom-8 text-xs text-[#9aa3c2] text-center px-4">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-[#5c6bc0] font-medium hover:underline">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to BingBong?{" "}
                <Link to="/register" className="text-[#5c6bc0] font-medium hover:underline">
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right panel – form */}
        <div className="flex-1 flex items-center justify-center py-8 px-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {location.pathname === "/login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full max-w-sm"
              >
                <LoginPage />
              </motion.div>
            )}
            {location.pathname === "/register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full max-w-sm"
              >
                <RegisterPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
