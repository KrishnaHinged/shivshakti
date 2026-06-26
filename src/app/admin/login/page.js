"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  loginAction,
  requestOtpAction,
  resetPasswordWithOtpAction,
} from "@/features/admin/services/authActions";
import { AlertTriangle, Info } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [view, setView] = useState("login"); // "login", "forgot", "reset"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await loginAction(formData);
    setLoading(false);

    if (res.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(res.error || "Login failed.");
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("email", email);

    const res = await requestOtpAction(formData);
    setLoading(false);

    if (res.success) {
      setMessage(res.message);
      setView("reset");
    } else {
      setError(res.error || "Failed to request OTP.");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    formData.append("newPassword", newPassword);

    const res = await resetPasswordWithOtpAction(formData);
    setLoading(false);

    if (res.success) {
      setMessage(
        "Password reset successful. Please sign in with your new credentials."
      );
      setView("login");
      setPassword("");
    } else {
      setError(res.error || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0b09] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.25)_0%,rgba(15,11,9,0.95)_100%)] z-10" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-orange/10 rounded-full blur-[100px] z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-blue/15 rounded-full blur-[100px] z-10" />

      <div className="relative z-20 w-full max-w-[420px]">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <img
            src="/images/logo.png"
            alt="SHIVSHAKTI Logo"
            className="h-14 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold tracking-tight">Shivshakti Control Panel</h1>
          <p className="text-xs text-slate-400 mt-1.5">Super Admin Authorization Gate</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-lg mb-6 leading-relaxed flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-300 text-xs px-4 py-3 rounded-lg mb-6 leading-relaxed flex items-center gap-2">
              <Info className="w-4 h-4 text-green-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* VIEW: LOGIN */}
          {view === "login" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shivshakti.com"
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4.5 py-3 text-white text-[0.92rem] outline-none focus:border-brand-orange focus:bg-white/10 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot");
                      setError("");
                      setMessage("");
                    }}
                    className="text-xs text-brand-orange hover:text-brand-orange-light font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4.5 py-3 text-white text-[0.92rem] outline-none focus:border-brand-orange focus:bg-white/10 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-brand-orange text-white w-full rounded-xl py-3.5 mt-2.5 font-semibold text-center hover:bg-brand-orange-light hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shivshakti.com"
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4.5 py-3 text-white text-[0.92rem] outline-none focus:border-brand-orange focus:bg-white/10 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-brand-orange text-white w-full rounded-xl py-3.5 mt-2.5 font-semibold text-center hover:bg-brand-orange-light transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Generating OTP..." : "Send Reset OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setError("");
                  setMessage("");
                }}
                className="text-xs text-slate-400 hover:text-white mt-1.5 text-center font-bold"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* VIEW: RESET PASSWORD */}
          {view === "reset" && (
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-4.5">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 text-[0.75rem] text-slate-300 leading-normal mb-1">
                OTP printed in terminal console / seeded activity log.
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400">
                  Verification OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                  maxLength={6}
                  className="bg-white/5 border border-white/10 rounded-xl px-4.5 py-3 text-white text-[0.92rem] outline-none focus:border-brand-orange focus:bg-white/10 transition text-center tracking-widest font-bold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] uppercase tracking-wider font-bold text-slate-400">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="bg-white/5 border border-white/10 rounded-xl px-4.5 py-3 text-white text-[0.92rem] outline-none focus:border-brand-orange focus:bg-white/10 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-brand-orange text-white w-full rounded-xl py-3.5 mt-2.5 font-semibold text-center hover:bg-brand-orange-light transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Updating Password..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setError("");
                  setMessage("");
                }}
                className="text-xs text-slate-400 hover:text-white mt-1.5 text-center font-bold"
              >
                Cancel and Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
