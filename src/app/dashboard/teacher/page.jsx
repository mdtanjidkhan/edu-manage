"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiClock, 
  FiUsers, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiArrowRight, 
  FiCalendar,
  FiFileText,
  FiCheckSquare
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function TeacherDashboardPage() {
 
  const { data: session } = authClient.useSession();
  const teacherEmail = session?.user?.email;
  const [stats, setStats] = useState({
    todaysClasses: 0,
    totalStudents: 0,
    pendingMarks: 0,
    isAttendanceTaken: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/teacher/dashboard-stats?email=${teacherEmail}`);
        const data = await res.json();
        console.log("Dashboard stats fetched:", data);
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [teacherEmail]);

  // আজকের তারিখ ফরম্যাট করা
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-3 sm:p-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <FiCalendar size={13} /> {todayFormatted}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content">
            Welcome back, Teacher! 👋
          </h1>
          <p className="text-sm text-base-content/70 max-w-xl">
            Here is what's happening with your classes and students today. Check your daily summary below.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Classes */}
        <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Today's Classes</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <FiClock size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-base-content">
            {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.todaysClasses}
          </div>
          <p className="text-xs text-base-content/60">Scheduled for today</p>
        </div>

        {/* Total Students */}
        <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <FiUsers size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-base-content">
            {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.totalStudents}
          </div>
          <p className="text-xs text-base-content/60">Under your assigned classes</p>
        </div>

        {/* Pending Marks */}
        <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Pending Marks</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <FiAlertCircle size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-base-content">
            {loading ? <span className="loading loading-spinner loading-sm"></span> : stats.pendingMarks}
          </div>
          <p className="text-xs text-base-content/60">Subject exams to evaluate</p>
        </div>

        {/* Attendance Status */}
        <div className="bg-base-100 border border-base-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Attendance Status</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              stats.isAttendanceTaken ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            }`}>
              <FiCheckCircle size={18} />
            </div>
          </div>
          <div className="text-lg font-bold text-base-content">
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : stats.isAttendanceTaken ? (
              <span className="text-success flex items-center gap-1.5">Completed</span>
            ) : (
              <span className="text-warning flex items-center gap-1.5">Not Taken Yet</span>
            )}
          </div>
          <p className="text-xs text-base-content/60">Today's daily roll call</p>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="bg-base-100 border border-base-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-base-content">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/dashboard/teacher/attendance"
            className="flex items-center justify-between p-4 rounded-xl border border-base-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <FiCheckSquare size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors">Take Attendance</h3>
                <p className="text-xs text-base-content/60">Mark today's student presence</p>
              </div>
            </div>
            <FiArrowRight className="text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link 
            href="/dashboard/teacher/marks"
            className="flex items-center justify-between p-4 rounded-xl border border-base-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <FiFileText size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors">Input Marks</h3>
                <p className="text-xs text-base-content/60">Enter exam marks for students</p>
              </div>
            </div>
            <FiArrowRight className="text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>

          <Link 
            href="/dashboard/teacher/students"
            className="flex items-center justify-between p-4 rounded-xl border border-base-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <FiUsers size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-base-content group-hover:text-primary transition-colors">My Students</h3>
                <p className="text-xs text-base-content/60">View student profiles & list</p>
              </div>
            </div>
            <FiArrowRight className="text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}