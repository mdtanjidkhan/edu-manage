"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { FiClock, FiMapPin, FiUser, FiCalendar, FiBookOpen } from "react-icons/fi";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function StudentRoutinePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [routineData, setRoutineData] = useState(null);
  
  // আজকের বার খেলাধুলার মতো সিলেক্টেড থাকবে
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [selectedDay, setSelectedDay] = useState(days.includes(todayName) ? todayName : "Sunday");

  useEffect(() => {
    const fetchRoutine = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/student/routine?email=${session.user.email}`
        );
        const result = await res.json();
        if (result.success) setRoutineData(result.data);
      } catch (err) {
        console.error("Routine Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, [session?.user?.email]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <span className="loading loading-spinner text-primary loading-lg"></span>
        <p className="text-sm text-base-content/60 font-medium">Loading Routine Schedule...</p>
      </div>
    );
  }

  const { className, group, weeklyRoutine = [] } = routineData || {};
  const currentDayClasses = weeklyRoutine.find((d) => d.day === selectedDay)?.classes || [];

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 border border-base-200 p-5 rounded-3xl shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
            <FiCalendar className="text-primary" /> Class Routine
          </h1>
          <p className="text-xs text-base-content/60 mt-1">
            Class: <span className="font-semibold text-base-content">{className}</span> | Group: <span className="font-semibold text-base-content">{group}</span>
          </p>
        </div>
      </div>

      {/* Day Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day) => {
          const isToday = day === todayName;
          const isActive = day === selectedDay;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                isActive
                  ? "bg-primary text-primary-content border-primary shadow-xs"
                  : "bg-base-100 text-base-content/70 border-base-200 hover:border-primary/40"
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? "bg-base-100/20 text-white" : "bg-primary/10 text-primary"}`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Routine Cards Grid */}
      <div className="bg-base-100 border border-base-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-base-200 pb-4">
          <h2 className="font-bold text-base text-base-content">
            Schedule for {selectedDay}
          </h2>
          <span className="text-xs font-medium text-base-content/60 bg-base-200/50 px-3 py-1 rounded-xl">
            {currentDayClasses.length} Session(s)
          </span>
        </div>

        {currentDayClasses.length === 0 ? (
          <div className="text-center py-12 text-base-content/60 space-y-2">
            <div className="p-3 bg-base-200/50 rounded-full w-fit mx-auto text-base-content/40">
              <FiBookOpen size={24} />
            </div>
            <p className="text-sm font-medium">No classes scheduled on {selectedDay}!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDayClasses.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-base-200 bg-base-200/30 hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm text-base-content">{item.subjectName}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-xl flex items-center gap-1 shrink-0">
                    <FiMapPin size={12} /> Room {item.roomNo}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-base-content/70 pt-1">
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-primary" size={14} />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiUser className="text-primary" size={14} />
                    <span>Teacher : {item.teacherName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}