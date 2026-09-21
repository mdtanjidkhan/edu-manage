"use client";

import { useRouter } from "next/navigation";
import { HiOutlineShieldExclamation, HiOutlineHome, HiOutlineArrowLeft } from "react-icons/hi2";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-50 dark:bg-[#0f172a] px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#111827] border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 text-center shadow-xl shadow-gray-100/50 dark:shadow-none space-y-6">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto animate-bounce shadow-sm">
          <HiOutlineShieldExclamation className="size-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            403 - Access Denied
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400 leading-relaxed">
            Oops! You don&apos;t have permission to access this section. Your current role doesn&apos;t match this dashboard routing guard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
          
          <button
            onClick={() => router.push("/login")}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/10 active:scale-95 transition-all text-center whitespace-nowrap"
          >
            <HiOutlineArrowLeft className="size-4 shrink-0" />
            Go to Login
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-gray-700 dark:text-slate-200 font-bold text-sm rounded-xl active:scale-95 transition-all text-center border border-gray-200/40 dark:border-slate-700 whitespace-nowrap"
          >
            <HiOutlineHome className="size-4 shrink-0" />
            Back to Home
          </button>

        </div>

      </div>
      <p className="text-xs text-gray-400 dark:text-slate-500 font-medium mt-6">
        Protected Workspace Router Engine.
      </p>
    </div>
  );
}