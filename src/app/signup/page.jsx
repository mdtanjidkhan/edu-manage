"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Signup failed!");
    } else {
      toast.success("Account created successfully! Please login.");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-black text-primary tracking-tight">
            Edu<span className="text-base-content">Manage</span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight mt-3">
            Create an account
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Fill in your details below to register for an account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name Field */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium text-sm">Full Name</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-lg pointer-events-none" />
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full pl-10 focus:outline-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium text-sm">Email Address</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-lg pointer-events-none" />
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

          {/* Password Field */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium text-sm">Password</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-lg pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 pr-10 focus:outline-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-2 font-semibold text-base"
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-base-content/70 mt-6 pt-4 border-t border-base-200">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}