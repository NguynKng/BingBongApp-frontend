import React, { useState, useEffect, useRef } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const action = searchParams.get("action");

  const [code, setCode] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (value, index) => {
    if (!isNaN(value) && value.length === 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Focus next input
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);

      // Focus previous input
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6); // Lấy tối đa 6 ký tự
    if (/^\d{1,6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);

      // Focus vào ô cuối cùng
      inputRefs.current[newCode.length - 1]?.focus();
    } else {
      toast.error("Please paste only numeric values.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const verificationCode = code.join("");
      const res = await authAPI.verifyCode(email, verificationCode, action);
      if (res.success) {
        if (action === "resetPassword") {
          toast.success("Code verified! You can now reset your password.");
          navigate(`/change-password?email=${email}`);
        } else {
          toast.success("Code verified! You can now log in.");
          navigate("/login");
        }
      }
    } catch (error) {
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          ✉️ Verify Your Email
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Please enter the 6-digit code we sent to your email.
        </p>

        {/* Countdown Timer */}
        <div className="text-center text-sm text-gray-600 mb-4">
          Time remaining:{" "}
          <span className="font-bold text-red-500">
            {formatTime(timeLeft)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code Input */}
          <div
            className="flex justify-center gap-2"
            onPaste={handlePaste} // Thêm sự kiện onPaste
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform duration-150 focus:scale-110"
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
