
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { FiMail } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    setLoading(false);

    if (error) {
      setErrorMessage(
        error.message || "Unable to send password reset email."
      );
      return;
    }

    setMessage(
      "If an account exists with this email, a password reset link has been sent."
    );
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8">
        {/* Header */}
        <div className="text-center mb-7">
          <Link
            href="/"
            className="text-3xl font-black text-primary tracking-tight"
          >
            Edu<span className="text-base-content">Manage</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content mt-4">
            Forgot Password?
          </h1>

          <p className="text-sm text-base-content/60 mt-2 leading-relaxed">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="alert alert-success text-sm mb-4 rounded-xl">
            <span>{message}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-error text-sm mb-4 rounded-xl">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-5">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium">
                Email Address
              </span>
            </label>

            <div className="relative">
              <FiMail
                className="absolute left-3.5 top-3.5 text-base-content/40 text-lg  "
                size={19}
              />

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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full font-semibold"
          >
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

        {/* Footer */}
        <div className="text-center text-sm text-base-content/70 mt-7 pt-5 border-t border-base-200">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

