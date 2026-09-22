"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail } from "react-icons/fi";
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

      // handleReset function-er bhetor success hole redirect korun:
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8">
        <div className="text-center mb-7">
          <Link href="/" className="text-3xl font-black text-primary tracking-tight">
            Edu<span className="text-base-content">Manage</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content mt-4">
            Forgot Password?
          </h1>
          <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div className="alert alert-success text-sm mb-4 rounded-xl">
            <span>{message}</span>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error text-sm mb-4 rounded-xl">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5 text-base-content/40 text-lg" size={19} />
              <input
                type="email"
                placeholder="name@school.com"
                className="input input-bordered w-full pl-10 focus:outline-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full font-semibold">
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-base-content/70 mt-7 pt-5 border-t border-base-200">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

