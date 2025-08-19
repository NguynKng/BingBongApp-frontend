import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const handleReset = async () => {
    if (!password || !confirm) return toast.error("Please fill in all fields");
    if (password !== confirm) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Password too short");
    console.log("test")

    try {
      const res = await authAPI.resetPassword(email, password);

      if (res.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-md shadow-xl border border-gray-200 w-[24rem]">
        <h1 className="text-xl font-semibold text-center mb-4">Reset Password</h1>
        <input
          type="password"
          placeholder="New password"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
