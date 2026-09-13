"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client"; // আপনার অথেন্টিকেশন হুক
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function TeacherCheckInPage() {
  const { data: session } = useSession();
  const [attendance, setAttendance] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // আজকের অ্যাটেনডেন্স স্ট্যাটাস চেক করা
  useEffect(() => {
    const checkStatus = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`http://localhost:5000/api/teacher/attendance-status?teacherEmail=${session.user.email}`);
        const data = await res.json();

        if (data.success) {
          setHasCheckedIn(data.hasCheckedIn);
          setAttendance(data.attendance);
        }
      } catch (err) {
        console.error("Failed to fetch attendance status:", err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [session?.user?.email]);

  // চেক-ইন বাটন সাবমিট হ্যান্ডলার
  const handleCheckIn = async () => {
    if (!session?.user?.email) return;

    setSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("http://localhost:5000/api/teacher/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherEmail: session.user.email,
          teacherName: session.user.name || "Teacher",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setHasCheckedIn(true);
        setAttendance(data.attendance);
        setMessage({ text: data.message, type: "success" });
      } else {
        setMessage({ text: data.message, type: "error" });
      }
    } catch (err) {
      console.error("Check-in error:", err);
      setMessage({ text: "Server error! Please try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        <span className="loading loading-spinner text-primary loading-sm"></span>
        <span className="text-xs text-base-content/60">Checking daily attendance status...</span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* বাম পাশের ইনফরমেশন */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FiClock className="text-primary" size={18} />
          <h2 className="text-base font-bold text-base-content">Daily Attendance</h2>
        </div>
        <p className="text-xs text-base-content/60">
          Mark your presence for today ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}).
        </p>

        {message.text && (
          <p className={`text-xs font-semibold mt-1 ${message.type === 'success' ? 'text-success' : 'text-error'}`}>
            {message.text}
          </p>
        )}
      </div>

      {/* ডান পাশের চেক-ইন বাটন বা স্ট্যাটাস */}
      <div>
        {hasCheckedIn ? (
          <div className="flex items-center gap-2 bg-success/10 text-success px-4 py-2.5 rounded-xl border border-success/20">
            <FiCheckCircle size={18} />
            <div className="text-xs">
              <span className="font-bold block">
                {attendance?.status === "Late" ? "Checked In (Late)" : "Checked In (Present)"}
              </span>
              <span className="text-success/80 text-[11px]">Time: {attendance?.inTime}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleCheckIn}
            disabled={submitting}
            className="btn btn-primary btn-sm rounded-xl px-5 font-semibold shadow-xs flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Processing...
              </>
            ) : (
              <>
                <FiClock size={15} />
                Give Attendance (Check-In)
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}