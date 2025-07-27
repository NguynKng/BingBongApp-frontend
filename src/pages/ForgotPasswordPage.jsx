import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      if (res.success) {
        navigate(`/verify-code?email=${email}&action=resetPassword`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center bg-gray-50 min-h-screen p-4">
        <div className="flex flex-col items-center gap-4 bg-white rounded-md py-4 px-6 w-[26rem] mt-4 shadow-xl border border-gray-200">
          <h1 className="text-center text-xl font-medium text-black">
            Reset Your Password
          </h1>
          <p className="text-sm text-center text-gray-500">
            We will send you an email to reset your password
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="py-2 px-4 text-sm block w-full h-10 bg-gray-200 rounded-md"
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer"
            onClick={handleSubmit}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;
