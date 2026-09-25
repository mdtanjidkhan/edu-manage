"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-black text-primary tracking-tight">
            Edu<span className="text-base-content">Manage</span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight mt-3">
            Welcome back
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Please enter your details to sign in to your portal.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-medium text-sm">Email Address</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3.5 text-base-content/40 text-lg" />
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

          <div className="form-control w-full">
            <div className="flex justify-between items-center py-1">
              <label className="label py-0">
                <span className="label-text font-medium text-sm">Password</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-primary font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-base-content/40 text-lg" />
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
                className="absolute right-3.5 top-3.5 text-base-content/50 hover:text-base-content"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-2 font-semibold text-base"
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-base-content/70 mt-6 pt-4 border-t border-base-200">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}