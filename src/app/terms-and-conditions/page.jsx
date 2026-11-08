"use client";

import Link from "next/link";
import { FiFileText, FiCheckCircle, FiAlertCircle, FiLock, FiMail, FiArrowLeft } from "react-icons/fi";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back to Home / Navigation */}
        <div>
          <Link href="/" className="btn btn-ghost btn-sm gap-2 text-base-content/70 hover:text-primary rounded-xl">
            <FiArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-base-100 border border-base-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl">
            <FiFileText size={28} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content">
            Terms and Conditions
          </h1>
          <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
            Welcome to EduManage. By accessing or using our school management platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-base-200 text-xs text-base-content/60 font-medium">
            <span>Last Updated: February 2026</span>
            <span className="badge badge-warning badge-sm font-semibold">Demo Policy – Subject to Update</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          
          {/* Section 1 */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-extrabold">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              By registering, accessing, or utilizing EduManage, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue use of the platform immediately.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-extrabold">2</span>
              User Accounts & Security
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Users (administrators, teachers, students, and parents) are responsible for maintaining the confidentiality of their login credentials. You agree to notify us immediately of any unauthorized use of your account or security breaches.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-extrabold">3</span>
              System Usage & Acceptable Conduct
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              You agree to use EduManage strictly for lawful educational and administrative purposes. Any attempt to disrupt system stability, scrape unauthorized institutional data, or upload malicious code will result in immediate termination of access.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-extrabold">4</span>
              Intellectual Property Rights
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              All source code, UI/UX designs, system logos, documentation, and interface assets associated with EduManage are the intellectual property of the platform developers and are protected under copyright laws.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-extrabold">5</span>
              Modifications to Terms
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              We reserve the right to modify or replace these Terms and Conditions at any time. Continued use of the platform after any changes constitutes acceptance of the new terms. For inquiries, contact <span className="font-semibold text-primary">legal@edumanage.demo</span>.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}