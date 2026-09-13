"use client";
import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
 // অথবা আপনার Auth Hook (যেমন: useAuth)
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiUserCheck, 
  FiSave 
} from "react-icons/fi";

export default function TeacherAttendancePage() {
  const { data: session } = useSession(); // Logged-in user session
  const teacherEmail = session?.user?.email;

  const [classId, setClassId] = useState("Class 8");
  const [group, setGroup] = useState("General");
  const [subject, setSubject] = useState("Electrical Circuits");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/teacher/students?classId=${encodeURIComponent(classId)}&group=${encodeURIComponent(group)}`);
        const data = await res.json();

        if (data.success && data.students) {
          setStudents(data.students);

          const initialStatus = {};
          data.students.forEach((s) => {
            initialStatus[s._id] = "Present";
          });
          setAttendance(initialStatus);
        } else {
          setStudents([]);
          setAttendance({});
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setStudents([]);
        setAttendance({});
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId, group]);

  const toggleStatus = (id, status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s._id] = status;
    });
    setAttendance(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (students.length === 0) return;

    if (!teacherEmail) {
      alert("Teacher email not found. Please log in first.");
      return;
    }

    setSubmitting(true);

    const records = students.map((student) => ({
      studentId: student._id,
      studentName: student.name,
      roll: student.roll || student.studentId,
      status: attendance[student._id] || "Present",
    }));

    try {
      const res = await fetch("http://localhost:5000/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          date, 
          classId, 
          group,
          subject, 
          records,
          teacherEmail // <-- teacherName-এর বদলে teacherEmail পাঠাচ্ছি
        }),
      });
      const data = await res.json();

      if (data.success) {
        setToastMsg("Attendance submitted successfully!");
        setTimeout(() => setToastMsg(""), 3000);
      } else {
        alert(data.message || "Failed to submit attendance");
      }
    } catch (err) {
      console.error("Attendance submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {toastMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success text-white shadow-lg rounded-xl flex items-center gap-2">
            <FiCheckCircle size={18} />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2.5">
          <FiUserCheck className="text-primary" /> Daily Attendance Entry
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1">
          Select class, group, and subject to record daily student attendance.
        </p>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-semibold text-base-content/70 mb-1 block">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-base-content/70 mb-1 block">Select Class</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
          >
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-base-content/70 mb-1 block">Group</label>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
          >
            <option value="General">General</option>
            <option value="Science">Science</option>
            <option value="Arts">Arts</option>
            <option value="Commerce">Commerce</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-base-content/70 mb-1 block">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-base-200 pb-3">
          <span className="text-base font-bold text-base-content">
            Students List ({students.length})
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => markAll("Present")}
              disabled={students.length === 0}
              className="btn btn-xs btn-outline btn-success rounded-lg"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => markAll("Absent")}
              disabled={students.length === 0}
              className="btn btn-xs btn-outline btn-error rounded-lg"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-base-content/60 text-sm">
            No students found for {classId} ({group}).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-base-200">
                  <th>ID / Roll</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const isPresent = attendance[student._id] === "Present";
                  return (
                    <tr key={student._id} className="hover:bg-base-200/50">
                      <td className="font-bold">{student.studentId || student.roll || "N/A"}</td>
                      <td>{student.name}</td>
                      <td className="text-xs text-base-content/70">{student.group || "N/A"}</td>
                      <td className="text-center">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => toggleStatus(student._id, "Present")}
                            className={`btn btn-sm rounded-xl gap-1 ${
                              isPresent ? "btn-success text-white" : "btn-ghost text-base-content/40"
                            }`}
                          >
                            <FiCheckCircle size={14} /> Present
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(student._id, "Absent")}
                            className={`btn btn-sm rounded-xl gap-1 ${
                              !isPresent ? "btn-error text-white" : "btn-ghost text-base-content/40"
                            }`}
                          >
                            <FiXCircle size={14} /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || students.length === 0}
          className="btn btn-primary w-full rounded-xl gap-2 mt-4"
        >
          {submitting ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              <FiSave size={18} /> Save Attendance Records
            </>
          )}
        </button>
      </div>
    </div>
  );
}