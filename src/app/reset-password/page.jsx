
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiLock, FiKey, FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message);
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setErrorMessage(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card Wrapper with Gradient Border */}
      <div className="relative w-full max-w-md p-[1.5px] rounded-3xl bg-gradient-to-b from-purple-500 via-indigo-500/30 to-blue-500/20 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
        <div className="w-full bg-slate-900/90 rounded-[23px] px-6 py-6 space-y-4 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center relative space-y-1">
            <Link href="/" className="text-xl font-black tracking-tight text-white inline-block mb-0.5">
              Edu<span className="text-purple-400">Manage</span>
            </Link>
            
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-[11px] text-slate-400 leading-relaxed px-4">
              Enter the 6-digit OTP sent to your email along with your new password.
            </p>
          </div>

          {/* Success Alert */}
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <FiCheckCircle className="text-base flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <FiAlertCircle className="text-base flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-3">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 block ml-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-3.5 text-purple-400 text-base pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@school.com"
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* OTP Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 block ml-1">
                6-Digit OTP
              </label>
              <div className="relative flex items-center">
                <FiKey className="absolute left-3.5 text-purple-400 text-base pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs tracking-widest font-mono text-purple-300 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 block ml-1">
                New Password
              </label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3.5 text-purple-400 text-base pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-300 block ml-1">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3.5 text-purple-400 text-base pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2 px-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition duration-200 active:scale-[0.99] disabled:opacity-70 cursor-pointer text-xs"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <FiArrowRight className="text-base" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 pt-1 border-t border-slate-800">
            <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center gap-1 transition">
              <FiArrowLeft className="text-xs" /> Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <span className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}