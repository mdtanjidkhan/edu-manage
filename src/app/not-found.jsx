"use client";

import Link from "next/link";
import { FiHome, FiLogIn, FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FiAlertCircle size={32} />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-7xl font-bold tracking-tight text-primary">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-2 text-base-content/60 leading-relaxed">
          Sorry, the page you are looking for doesn&apos;t exist
          or may have been moved.
        </p>

        {/* Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/"
            className="btn btn-primary gap-2"
          >
            <FiHome size={18} />
            Go Home
          </Link>

          <Link
            href="/login"
            className="btn btn-outline gap-2"
          >
            <FiLogIn size={18} />
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}