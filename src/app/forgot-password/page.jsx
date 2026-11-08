
"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message);
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        setErrorMessage(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card Wrapper with Gradient Border */}
      <div className="relative w-full max-w-md p-[1.5px] rounded-3xl bg-gradient-to-b from-purple-500 via-indigo-500/30 to-blue-500/20 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
        <div className="w-full bg-slate-900/90 rounded-[23px] p-8 space-y-6 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center relative space-y-1">
            <Link href="/" className="text-2xl font-black tracking-tight text-white inline-block mb-1">
              Edu<span className="text-purple-400">Manage</span>
            </Link>
            
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Forgot Password?
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed px-2 pt-1">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Decorative Sub-line */}
            <div className="w-10 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mt-3" />
          </div>

          {/* Success Alert */}
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
              <FiCheckCircle className="text-lg flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
              <FiAlertCircle className="text-lg flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-4 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block ml-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-3.5 text-purple-400 text-lg pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@school.com"
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition duration-200 active:scale-[0.99] disabled:opacity-70 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <FiArrowRight className="text-lg" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest absolute">
              OR
            </span>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 pt-1">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center gap-1 transition">
              <FiArrowLeft className="text-sm" /> Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

