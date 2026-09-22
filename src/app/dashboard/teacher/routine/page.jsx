"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; // Better Auth Client Path
import { 
  FiClock, 
  FiBookOpen, 
  FiMapPin, 
  FiCalendar, 
  FiFilter 
} from "react-icons/fi";

export default function TeacherRoutinePage() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("All");

  // 1. Fetch Session from Better Auth
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const loggedInTeacherEmail = session?.user?.email;

  const fetchTeacherRoutines = async () => {
    if (!loggedInTeacherEmail) {
      console.log("No email found in Better Auth session yet!");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = loggedInTeacherEmail.trim();
      console.log("Fetching routines for email:", cleanEmail);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/teacher/routine/${encodeURIComponent(cleanEmail)}?day=${selectedDay}`
      );
      const data = await res.json();
      
      console.log("Backend response received:", data);

      if (data.success) {
        setRoutines(data.routines);
      }
    } catch (err) {
      console.error("Error fetching teacher routines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSessionLoading && loggedInTeacherEmail) {
      fetchTeacherRoutines();
    }
  }, [loggedInTeacherEmail, selectedDay, isSessionLoading]);

  const daysList = ["All", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

  // Show spinner while checking auth session
  if (isSessionLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // If user is not logged in
  if (!session) {
    return (
      <div className="text-center py-12 bg-base-100 rounded-2xl border border-base-300">
        <p className="text-error font-semibold">Please log in to view your class schedule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2">
          <FiClock className="text-primary" /> My Class Schedule
        </h1>
        <p className="text-sm text-base-content/60 mt-1">
          Logged in as: <span className="font-semibold text-primary">{loggedInTeacherEmail}</span>
        </p>
      </div>

      {/* Day Filter */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1 shrink-0">
          <FiFilter size={14} /> Filter Day:
        </span>
        <div className="flex gap-2">
          {daysList.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`btn btn-xs rounded-xl px-3 transition-all ${
                selectedDay === day
                  ? "btn-primary shadow-xs"
                  : "btn-ghost border border-base-300 hover:bg-base-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Grid */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs">
        {loading ? (
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : routines.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <FiClock size={36} className="mx-auto text-base-content/30" />
            <p className="text-base-content/60 text-sm font-medium">
              No class schedules found for {loggedInTeacherEmail}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routines.map((item) => (
              <div
                key={item._id}
                className="border border-base-200 rounded-xl p-4 space-y-3 bg-base-200/30 hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge badge-primary font-semibold text-xs">
                      {item.classId} ({item.group || "General"})
                    </span>
                    <span className="text-xs font-bold text-base-content/70 flex items-center gap-1">
                      <FiCalendar size={12} /> {item.day}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-base-content flex items-center gap-2">
                      <FiBookOpen size={16} className="text-primary shrink-0" /> {item.subjectName}
                    </h3>
                    <p className="text-xs text-base-content/70 flex items-center gap-1">
                      <FiClock size={12} className="shrink-0 text-primary" /> {item.startTime} - {item.endTime}
                    </p>
                    <p className="text-xs text-base-content/60 flex items-center gap-1">
                      <FiMapPin size={12} className="shrink-0" /> Room No: <span className="font-semibold text-base-content">{item.roomNo || "N/A"}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-base-200/60 flex items-center justify-between text-[11px] text-base-content/60">
                  <span>Assigned Teacher: {item.teacherName}</span>
                  <span className="badge badge-xs badge-success badge-outline">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}