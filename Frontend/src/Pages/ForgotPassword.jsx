import { useState } from "react";
import axios from "axios";
import Bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Step 1: Send OTP
  const sendOtp = async () => {
    setMsg("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/send-otp",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setMsg(res.data.msg);
      setStep(2); // Move to OTP step
    } catch (err) {
      console.error("Send OTP Error:", err.response?.data);
      setMsg(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //  Step 2: Reset Password
  const resetPassword = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/reset-password",
        { email, otp, password },
        { headers: { "Content-Type": "application/json" } }
      );
      setMsg(res.data.msg);
      // Redirect after success
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      console.error("Reset Password Error:", err.response?.data);
      setMsg(err.response?.data?.msg || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-cover"
      style={{ backgroundImage: `url(${Bg})` }}
    >
      <div className="w-[90%] max-w-[400px] bg-black/60 backdrop-blur p-6 rounded-xl shadow-lg flex flex-col gap-4 text-white">

        <h1 className="text-2xl font-semibold text-center">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h1>

        {/* Step 1: Enter Email to Get OTP */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendOtp();
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Enter registered email"
              className="w-full px-4 py-2 rounded border-2 text-white border-white outline-none rounded-full text-[18px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 py-2 rounded font-semibold hover:bg-blue-600 transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Reset Password */}
        {step === 2 && (
          <form onSubmit={resetPassword} className="flex flex-col gap-4">
            <input
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded text-white border-2 border-white outline-none rounded-full text-[18px]"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 rounded text-white border-2 border-white outline-none rounded-full text-[18px]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 py-2 rounded font-semibold hover:bg-green-600 transition"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {msg && (
          <p className="text-center text-sm text-yellow-300">{msg}</p>
        )}

        <p
          className="text-sm text-center text-blue-400 cursor-pointer hover:underline"
          onClick={() => navigate("/signin")}
        >
          Back to Sign In
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
