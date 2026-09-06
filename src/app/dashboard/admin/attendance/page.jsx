"use client";
import { useEffect, useState } from "react";
import { 
  FiCalendar, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiSearch,
  FiUserCheck,
  FiUsers,
  FiBriefcase
} from "react-icons/fi";

export default function AdminAttendancePage() {
  const [activeTab, setActiveTab] = useState("students"); // 'students' or 'teachers'
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [studentRecords, setStudentRecords] = useState([]);
  const [teacherRecords, setTeacherRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Attendance Data
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // API call param -> subject
      const endpoint = activeTab === "students" 
        ? `http://localhost:5000/api/admin/attendance/students?date=${selectedDate}&subject=${selectedSubject}`
        : `http://localhost:5000/api/admin/attendance/teachers?date=${selectedDate}&subject=${selectedSubject}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      
      if (data.success) {
        if (activeTab === "students") {
          setStudentRecords(data.records || []);
        } else {
          setTeacherRecords(data.records || []);
        }
      }
    } catch (err) {
      console.error("Attendance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, selectedSubject, activeTab]);

  // Client-side search filtering
  const filteredStudentRecords = studentRecords.filter((item) => {
    const matchesSearch = 
      item.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacherName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredTeacherRecords = teacherRecords.filter((item) => {
    const matchesSearch = 
      item.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculations for Student Stats
  const totalStudents = studentRecords.reduce((acc, curr) => acc + (curr.students?.length || 0), 0);
  const totalStudentsPresent = studentRecords.reduce((acc, curr) => {
    return acc + (curr.students?.filter((s) => s.status === "Present").length || 0);
  }, 0);
  const studentPresentPercent = totalStudents > 0 ? Math.round((totalStudentsPresent / totalStudents) * 100) : 0;

  // Calculations for Teacher Stats
  const totalTeachers = teacherRecords.length;
  const teachersPresent = teacherRecords.filter((t) => t.status === "Present" || t.status === "Late").length;
  const teacherPresentPercent = totalTeachers > 0 ? Math.round((teachersPresent / totalTeachers) * 100) : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2.5">
          <FiCalendar className="text-primary" /> Attendance Management
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1">
          Monitor real-time daily attendance reports for both students and faculty members.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-base-300 gap-2">
        <button
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 py-3 px-5 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
            activeTab === "students"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
        >
          <FiUsers size={18} /> Student Attendance
        </button>

        <button
          onClick={() => setActiveTab("teachers")}
          className={`flex items-center gap-2 py-3 px-5 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
            activeTab === "teachers"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-base-content/60 hover:text-base-content"
          }`}
        >
          <FiBriefcase size={18} /> Teacher Attendance
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Date Picker */}
          <div className="w-full sm:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Subject Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="General Science">General Science</option>
              <option value="English">English</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="ICT">ICT</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder={activeTab === "students" ? "Search subject or teacher..." : "Search teacher name..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-base-content/60 font-medium">
              {activeTab === "students" ? "Student Attendance Rate" : "Teacher Attendance Rate"}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-base-content">
              {activeTab === "students" ? `${studentPresentPercent}%` : `${teacherPresentPercent}%`}
            </p>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-error/10 text-error rounded-xl">
            <FiXCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-base-content/60 font-medium">Total Absentees</p>
            <p className="text-xl sm:text-2xl font-bold text-error">
              {activeTab === "students" 
                ? `${totalStudents - totalStudentsPresent} Students` 
                : `${totalTeachers - teachersPresent} Teachers`}
            </p>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <FiUserCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-base-content/60 font-medium">
              {activeTab === "students" ? "Classes Recorded" : "Teachers Tracked"}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-base-content">
              {activeTab === "students" ? `${studentRecords.length} Classes` : `${totalTeachers} Faculty Members`}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Tables */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <span className="loading loading-spinner text-primary"></span>
            <p className="text-sm text-base-content/60">Fetching attendance logs...</p>
          </div>
        ) : activeTab === "students" ? (
          /* TAB 1: STUDENT ATTENDANCE TABLE */
          filteredStudentRecords.length === 0 ? (
            <div className="text-center p-12 text-base-content/60 space-y-2">
              <FiClock size={32} className="mx-auto text-base-content/30" />
              <p className="font-semibold text-sm">No student attendance records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200/50 text-base-content/70 text-xs font-semibold uppercase">
                  <tr>
                    <th>Subject</th>
                    <th>Teacher Name</th>
                    <th>Present / Total</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200 text-sm">
                  {filteredStudentRecords.map((item, idx) => {
                    const present = item.students?.filter((s) => s.status === "Present").length || 0;
                    const total = item.students?.length || 0;
                    const percent = total > 0 ? Math.round((present / total) * 100) : 0;

                    return (
                      <tr key={item._id || idx} className="hover:bg-base-200/30 transition-colors">
                        <td>
                          <div className="font-bold text-base-content">{item.subjectName || "N/A"}</div>
                        </td>
                        <td>
                          <span className="font-semibold text-base-content/80">{item.teacherName || "N/A"}</span>
                        </td>
                        <td>
                          <span className="font-semibold text-success">{present}</span> / {total}
                        </td>
                        <td>
                          <span className={`badge badge-sm font-bold ${percent >= 75 ? 'badge-success' : 'badge-warning'}`}>
                            {percent}%
                          </span>
                        </td>
                        <td className="text-xs text-base-content/60">{item.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* TAB 2: TEACHER ATTENDANCE TABLE */
          filteredTeacherRecords.length === 0 ? (
            <div className="text-center p-12 text-base-content/60 space-y-2">
              <FiClock size={32} className="mx-auto text-base-content/30" />
              <p className="font-semibold text-sm">No teacher attendance records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200/50 text-base-content/70 text-xs font-semibold uppercase">
                  <tr>
                    <th>Teacher Name</th>
                    <th>Subject</th>
                    <th>Check In Time</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200 text-sm">
                  {filteredTeacherRecords.map((item, idx) => (
                    <tr key={item._id || idx} className="hover:bg-base-200/30 transition-colors">
                      <td className="font-bold text-base-content">{item.teacherName}</td>
                      <td>
                        <span className="badge badge-ghost badge-sm font-medium">
                          {item.subject || "N/A"}
                        </span>
                      </td>
                      <td className="text-xs font-mono">{item.checkInTime || "N/A"}</td>
                      <td>
                        <span className={`badge badge-sm font-bold ${
                          item.status === "Present" 
                            ? "badge-success" 
                            : item.status === "Late" 
                            ? "badge-warning" 
                            : "badge-error"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/60">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}