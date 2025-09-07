import React from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

export default function AuthContainer() {
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  return (
    <>
      <style>
        {`
          @keyframes gradient-x {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 6s ease-in-out infinite;
          }
        `}
      </style>

      <div className="flex items-center justify-center w-full min-h-screen animate-gradient-x bg-gradient-to-br from-blue-500 via-indigo-200 to-blue-200">
        <div className="relative bg-white/60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden max-w-4xl min-h-[650px] w-full">
          {/* Logo & Slogan động */}
          <motion.div
            className="hidden md:flex flex-col items-center justify-center absolute top-0 left-0 h-full w-1/2 z-10 bg-gradient-to-br from-blue-500 via-indigo-400 via-cyan-300 to-blue-200 animate-gradient-x text-white px-10 py-12"
            initial={false}
            animate={{
              x: isRegister ? "100%" : "0%",
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {/* Logo động */}
            <motion.img
              src={
                isRegister
                  ? "./images/ico/logo_bingbong.ico"
                  : "./images/ico/logo_bingbong.ico"
              }
              alt="BingBong Logo"
              style={{ width: "200px", height: "200px", objectFit: "contain" }}
              className="mb-6 rounded-full border-3 border-gray-200 shadow-lg"
              key={isRegister ? "logo-register" : "logo-login"}
              initial={{ x: isRegister ? -500 : 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />

            <h3 className="text-3xl font-bold mb-3 text-white drop-shadow text-center tracking-wide">
              Bing Bong Website
            </h3>
            <div className="w-full flex flex-col items-center justify-center mt-2">
              <span className="block text-base font-semibold text-blue-50 text-center tracking-wide">
                Mạng xã hội của cảm xúc –{" "}
                <span className="text-yellow-200 font-bold">
                  nhịp điệu của bạn
                </span>
                .
              </span>
              <span className="block text-base font-semibold text-blue-50 text-center tracking-wide mt-1">
                Với <span className="text-yellow-200 font-bold">Bing Bong</span>
                , mọi cảm xúc đều được ngân vang.
              </span>
            </div>
          </motion.div>

          {/* Form desktop động */}
          <div className="absolute top-0 h-full w-1/2 right-0 md:block hidden z-20">
            <AnimatePresence mode="wait">
              {location.pathname === "/login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full flex items-center"
                >
                  <LoginPage />
                </motion.div>
              )}
              {location.pathname === "/register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full flex items-center"
                  style={{ position: "absolute", left: "-100%", width: "100%" }}
                >
                  <RegisterPage />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form mobile động */}
          <div className="md:hidden w-full p-4">
            <AnimatePresence mode="wait">
              {location.pathname === "/login" && (
                <motion.div
                  key="login-m"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <LoginPage />
                </motion.div>
              )}
              {location.pathname === "/register" && (
                <motion.div
                  key="register-m"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <RegisterPage />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
