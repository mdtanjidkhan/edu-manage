
"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
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

    // Password validation check
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        toast.error(error.message || "Signup failed!");
      } else {
        toast.success("Account created successfully! Please login.");
        router.push("/login");
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card Wrapper with Gradient Border */}
      <div className="relative w-full max-w-md p-[1.5px] rounded-3xl bg-gradient-to-b from-purple-500 via-indigo-500/30 to-blue-500/20 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
        <div className="w-full bg-slate-900/90 rounded-[23px] p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center relative space-y-1">
            <Link href="/" className="text-2xl font-black tracking-tight text-white inline-block mb-1">
              Edu<span className="text-purple-400">Manage</span>
            </Link>
            
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-xs text-slate-400">
              Fill in your details below to register for an account
            </p>

            {/* Decorative Sub-line */}
            <div className="w-10 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mt-2" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4 pt-2">
            
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 block ml-1">Full Name</label>
              <div className="relative flex items-center">
                <FiUser className="absolute left-3.5 text-purple-400 text-lg pointer-events-none" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Address Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 block ml-1">Email Address</label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-3.5 text-purple-400 text-lg pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@school.com"
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1 mr-1">
                <label className="text-sm font-medium text-slate-300 block">Password</label>
                <span className="text-[11px] text-slate-400">Must be at least 8 characters</span>
              </div>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3.5 text-purple-400 text-lg pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
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
              className="w-full mt-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition duration-200 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign Up</span>
                  <FiArrowRight className="text-lg" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-2">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest absolute">
              OR
            </span>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 pt-1">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
              Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}