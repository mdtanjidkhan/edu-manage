"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { 
  FiCheckCircle, 
  FiBookOpen, 
  FiClock, 
  FiAward, 
  FiBell, 
  FiCalendar,
  FiMapPin 
} from "react-icons/fi";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/student/dashboard?email=${session.user.email}`
        );
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session?.user?.email]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <span className="loading loading-spinner text-primary loading-lg"></span>
        <p className="text-sm text-base-content/60 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  const { profile, stats, todayClasses = [], notices = [] } = data || {};

  return (
    <div className="space-y-6 pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            Welcome back, {profile?.name || session?.user?.name || "Student"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-base-content/70 mt-1">
            Class: <span className="font-semibold">{profile?.class}</span> | Group: <span className="font-semibold">{profile?.group}</span> | ID: <span className="font-semibold">{profile?.studentId}</span>
          </p>
        </div>
        <div className="px-4 py-2 bg-base-100 border border-base-200 rounded-2xl shadow-xs text-xs font-semibold text-base-content flex items-center gap-2">
          <FiCalendar className="text-primary" size={16} />
          <span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-base-100 border border-base-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/60 font-medium">Attendance Rate</p>
            <h3 className="text-2xl font-bold text-base-content mt-1">{stats?.attendancePercentage}%</h3>
            <span className={`text-[11px] font-medium mt-1 inline-block ${stats?.attendancePercentage >= 75 ? "text-success" : "text-error"}`}>
              {stats?.attendancePercentage >= 75 ? "Good Standing" : "Low Attendance"}
            </span>
          </div>
          <div className="p-3.5 bg-success/10 text-success rounded-2xl">
            <FiCheckCircle size={26} />
          </div>
        </div>

        <div className="bg-base-100 border border-base-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/60 font-medium">Attended Classes</p>
            <h3 className="text-2xl font-bold text-base-content mt-1">{stats?.presentCount} / {stats?.totalClasses}</h3>
            <span className="text-[11px] text-info font-medium mt-1 inline-block">Total Conducted</span>
          </div>
          <div className="p-3.5 bg-info/10 text-info rounded-2xl">
            <FiClock size={26} />
          </div>
        </div>

        <div className="bg-base-100 border border-base-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/60 font-medium">Today's Classes</p>
            <h3 className="text-2xl font-bold text-base-content mt-1">{todayClasses.length}</h3>
            <span className="text-[11px] text-primary font-medium mt-1 inline-block">Scheduled Sessions</span>
          </div>
          <div className="p-3.5 bg-primary/10 text-primary rounded-2xl">
            <FiBookOpen size={26} />
          </div>
        </div>

        <div className="bg-base-100 border border-base-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-base-content/60 font-medium">Academic Status</p>
            <h3 className="text-2xl font-bold text-base-content mt-1">Active</h3>
            <span className="text-[11px] text-secondary font-medium mt-1 inline-block">Regular Student</span>
          </div>
          <div className="p-3.5 bg-secondary/10 text-secondary rounded-2xl">
            <FiAward size={26} />
          </div>
        </div>
      </div>

      {/* Routine & Notice Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-base-100 border border-base-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-base-content flex items-center gap-2">
              <FiClock className="text-primary" /> Today's Class Routine
            </h2>
          </div>

          {todayClasses.length === 0 ? (
            <div className="text-center py-8 text-base-content/60 text-sm">
              No classes scheduled for today! 🎉
            </div>
          ) : (
            <div className="space-y-3">
              {todayClasses.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-base-200 bg-base-200/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-base-content">{item.subjectName}</h4>
                    <p className="text-xs text-base-content/60 mt-0.5">Teacher: {item.teacherName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-3 py-1 bg-base-100 rounded-xl border border-base-200 flex items-center gap-1">
                      <FiClock size={12} className="text-primary" /> {item.startTime} - {item.endTime}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-xl flex items-center gap-1">
                      <FiMapPin size={12} /> Room {item.roomNo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-base-100 border border-base-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-base-content flex items-center gap-2">
            <FiBell className="text-primary" /> Notices
          </h2>

          {notices.length === 0 ? (
            <div className="text-center py-8 text-base-content/60 text-sm">No recent notices.</div>
          ) : (
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-3.5 rounded-2xl border border-base-200 hover:border-primary/40 transition-all space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-primary">{n.category}</span>
                    <span className="text-base-content/50">{n.date}</span>
                  </div>
                  <h4 className="font-bold text-xs text-base-content">{n.title}</h4>
                  <p className="text-[11px] text-base-content/60 line-clamp-2">{n.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}