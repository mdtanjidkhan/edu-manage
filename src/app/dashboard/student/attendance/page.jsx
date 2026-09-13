"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { FiCheckCircle, FiXCircle, FiBarChart2, FiBookOpen, FiCalendar } from "react-icons/fi";

export default function StudentAttendancePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/student/attendance?email=${session.user.email}`
        );
        const result = await res.json();
        if (result.success) setAttendanceData(result.data);
      } catch (err) {
        console.error("Attendance Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [session?.user?.email]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <span className="loading loading-spinner text-primary loading-lg"></span>
        <p className="text-sm text-base-content/60 font-medium">Loading Attendance Records...</p>
      </div>
    );
  }

  const { overall, subjectWiseStats = [], recentLogs = [] } = attendanceData || {};

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
          <FiBarChart2 className="text-primary" /> Attendance Records
        </h1>
        <p className="text-xs text-base-content/60 mt-1">Track your overall and subject-wise attendance performance.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-base-100 border border-base-200 p-4 rounded-2xl shadow-xs">
          <p className="text-xs text-base-content/60 font-medium">Overall Rate</p>
          <p className="text-2xl font-bold text-primary mt-1">{overall?.percentage || 0}%</p>
        </div>
        <div className="bg-base-100 border border-base-200 p-4 rounded-2xl shadow-xs">
          <p className="text-xs text-base-content/60 font-medium">Total Classes</p>
          <p className="text-2xl font-bold text-base-content mt-1">{overall?.totalClasses || 0}</p>
        </div>
        <div className="bg-base-100 border border-base-200 p-4 rounded-2xl shadow-xs">
          <p className="text-xs text-base-content/60 font-medium">Present</p>
          <p className="text-2xl font-bold text-success mt-1">{overall?.presentCount || 0}</p>
        </div>
        <div className="bg-base-100 border border-base-200 p-4 rounded-2xl shadow-xs">
          <p className="text-xs text-base-content/60 font-medium">Absent</p>
          <p className="text-2xl font-bold text-error mt-1">{overall?.absentCount || 0}</p>
        </div>
      </div>

      {/* Subject-wise Progress */}
      <div className="bg-base-100 border border-base-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-base-content flex items-center gap-2">
          <FiBookOpen className="text-primary" /> Subject-wise Performance
        </h2>

        {subjectWiseStats.length === 0 ? (
          <p className="text-xs text-base-content/60 py-4 text-center">No subject attendance recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectWiseStats.map((sub, idx) => (
              <div key={idx} className="p-4 border border-base-200 rounded-2xl space-y-2 bg-base-200/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-base-content">{sub.subjectName}</span>
                  <span className="font-semibold text-primary">{sub.percentage}% ({sub.present}/{sub.total})</span>
                </div>
                <div className="w-full bg-base-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      sub.percentage >= 80 ? "bg-success" : sub.percentage >= 60 ? "bg-warning" : "bg-error"
                    }`}
                    style={{ width: `${sub.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent History Table */}
      <div className="bg-base-100 border border-base-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-base-content flex items-center gap-2">
          <FiCalendar className="text-primary" /> Recent History
        </h2>

        {recentLogs.length === 0 ? (
          <p className="text-xs text-base-content/60 py-4 text-center">No attendance logs available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead>
                <tr className="border-base-200 text-base-content/60">
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} className="border-base-200 hover:bg-base-200/40">
                    <td className="font-medium text-base-content">{log.date}</td>
                    <td className="font-semibold">{log.subjectName}</td>
                    <td className="text-base-content/70">{log.teacherName}</td>
                    <td>
                      {log.status === "Present" ? (
                        <span className="inline-flex items-center gap-1 text-success font-semibold">
                          <FiCheckCircle size={14} /> Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-error font-semibold">
                          <FiXCircle size={14} /> Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}