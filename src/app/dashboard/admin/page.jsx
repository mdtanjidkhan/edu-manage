
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FiUsers, 
  FiUserCheck, 
  FiDollarSign, 
  FiCalendar, 
  FiPlus, 
  FiArrowRight,
  FiActivity
} from "react-icons/fi";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Express API 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/stats`);
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Unable to connect to Express backend server");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm font-medium text-base-content/60">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-6 max-w-xl mx-auto">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-base-100 to-base-100 p-6 rounded-2xl border border-base-300">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content">
            Welcome Back, Admin 👋
          </h1>
          <p className="text-sm text-base-content/70 mt-1">
            Here is what is happening across your institution today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/dashboard/admin/students" 
            className="btn btn-primary btn-sm sm:btn-md gap-2 rounded-xl shadow-md shadow-primary/20"
          >
            <FiPlus size={18} /> Add Student
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Total Students
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-base-content mt-1">
                {stats?.totalStudents || 0}
              </h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FiUsers size={24} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-xs text-base-content/60">
            <span>Active Enrolled</span>
            <Link href="/dashboard/admin/students" className="text-primary font-semibold hover:underline flex items-center gap-1">
              View All <FiArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Total Teachers
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-base-content mt-1">
                {stats?.totalTeachers || 0}
              </h3>
            </div>
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <FiUserCheck size={24} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-xs text-base-content/60">
            <span>Faculty Members</span>
            <Link href="/dashboard/admin/teachers" className="text-secondary font-semibold hover:underline flex items-center gap-1">
              Manage <FiArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Today's Attendance
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-base-content mt-1">
                {stats?.attendancePercentage || "0%"}
              </h3>
            </div>
            <div className="p-3 bg-accent/10 text-accent rounded-xl">
              <FiCalendar size={24} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-xs text-base-content/60">
            <span>Overall Campus Avg</span>
            <Link href="/dashboard/admin/attendance" className="text-accent font-semibold hover:underline flex items-center gap-1">
              Report <FiArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Fees Collection */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Fees Collected
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-base-content mt-1">
                ৳{stats?.totalFees?.toLocaleString() || 0}
              </h3>
            </div>
            <div className="p-3 bg-success/10 text-success rounded-xl">
              <FiDollarSign size={24} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-xs text-base-content/60">
            <span>This Month</span>
            <Link href="/dashboard/admin/fees" className="text-success font-semibold hover:underline flex items-center gap-1">
              Accounts <FiArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
            <FiActivity className="text-primary" /> Quick Management
          </h2>
          <div className="flex flex-col gap-3">
            <Link 
              href="/dashboard/admin/students" 
              className="flex items-center justify-between p-3.5 rounded-xl border border-base-200 hover:border-primary/50 hover:bg-base-200/50 transition-all group"
            >
              <span className="font-medium text-sm text-base-content">Manage Students Record</span>
              <FiArrowRight className="text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
            <Link 
              href="/dashboard/admin/teachers" 
              className="flex items-center justify-between p-3.5 rounded-xl border border-base-200 hover:border-primary/50 hover:bg-base-200/50 transition-all group"
            >
              <span className="font-medium text-sm text-base-content">Teacher Assignments & Profiles</span>
              <FiArrowRight className="text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
            <Link 
              href="/dashboard/admin/fees" 
              className="flex items-center justify-between p-3.5 rounded-xl border border-base-200 hover:border-primary/50 hover:bg-base-200/50 transition-all group"
            >
              <span className="font-medium text-sm text-base-content">Check Student Fee Status</span>
              <FiArrowRight className="text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* System Overview Notice */}
        <div className="lg:col-span-2 bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-base-content mb-2">
              System Notice & Status
            </h2>
            <p className="text-sm text-base-content/70 leading-relaxed">
              Express backend is connected successfully to MongoDB (<code className="text-primary font-mono text-xs">edumanage</code>). Real-time analytics for attendance and financial reporting will update as students and teachers complete daily operations.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-base-200 flex items-center justify-between text-xs text-base-content/50">
            <span>Server: Express (Port 5000)</span>
            <span className="badge badge-success badge-sm text-white font-medium">Database Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}