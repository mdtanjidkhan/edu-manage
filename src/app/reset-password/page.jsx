"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiLock, FiKey } from "react-icons/fi";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Forgot password page theke email query param hisebe ashle oita read korbe
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

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
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8">
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content">
            Reset Password
          </h1>
          <p className="text-sm text-base-content/60 mt-2">
            Enter the 6-digit OTP sent to your email along with your new password.
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

        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Email Input */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium">Email Address</span>
            </label>
            <input
              type="email"
              placeholder="name@school.com"
              className="input input-bordered w-full focus:outline-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* OTP Input */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium">6-Digit OTP</span>
            </label>
            <div className="relative">
              <FiKey className="absolute left-3.5 top-3.5 text-base-content/40 text-lg" size={19} />
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                className="input input-bordered w-full pl-10 tracking-widest font-mono text-lg focus:outline-primary"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium">New Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-base-content/40 text-lg" size={19} />
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 focus:outline-primary"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium">Confirm Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-base-content/40 text-lg" size={19} />
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 focus:outline-primary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full font-semibold mt-2">
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="text-center text-sm text-base-content/70 mt-7 pt-5 border-t border-base-200">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}