
"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.log("Better Auth Error Details:", error);
      toast.error(error.message || "Invalid email or password!");
    } else {
      const session = await authClient.getSession();
      const role = session?.data?.user?.role;

      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "teacher") {
        router.push("/dashboard/teacher");
      } else {
        router.push("/dashboard/student");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
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
            
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400">
              Login to your account
            </p>

            {/* Decorative Sub-line */}
            <div className="w-10 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mt-2" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block ml-1">Email</label>
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

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block ml-1">Password</label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-3.5 text-purple-400 text-lg pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember me</span>
              </label>

              <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300 font-medium transition">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition duration-200 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
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
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-purple-400 hover:text-purple-300 hover:underline">
              Sign up
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}