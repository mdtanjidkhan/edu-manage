"use client";

import Link from "next/link";
import { FiShield, FiLock, FiEye, FiServer, FiMail, FiArrowLeft } from "react-icons/fi";

export default function PrivacyPolicyPage() {
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
            <FiShield size={28} />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
            At EduManage, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our school management system.
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
              Information We Collect
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              We collect information necessary to provide efficient educational administration services. This includes user account details (names, email addresses, phone numbers), student records, attendance logs, academic grades, and billing information for school fee management.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-extrabold">2</span>
              How We Use Your Information
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              The collected data is used exclusively to operate, maintain, and improve EduManage features. This encompasses generating routine reports, managing student-teacher interactions, processing fee transactions, and sending critical institutional notifications.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-extrabold">3</span>
              Data Security & Protection
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              We implement industry-standard security measures, including data encryption, role-based access control, and secure token authentication (JWT/Better Auth), to safeguard your institutional data against unauthorized access, alteration, or disclosure.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-extrabold">4</span>
              Sharing of Information
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              We do not sell, trade, or rent personal identification information to third parties. Data is only shared with authorized school personnel, administrators, and trusted infrastructure providers bound by strict confidentiality agreements.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-base-100 border border-base-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-extrabold">5</span>
              Contact Information
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy or our data practices, please feel free to reach out to our support team at <span className="font-semibold text-primary">support@edumanage.demo</span>.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}