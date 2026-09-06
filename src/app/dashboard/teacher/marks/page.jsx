"use client";
import { useState, useEffect } from "react";
import { 
  FiFileText, 
  FiSave, 
  FiTrash2, 
  FiEdit3, 
  FiBook, 
  FiLayers, 
  FiAward,
  FiCheckCircle,
  FiUser,
  FiHash
} from "react-icons/fi";

export default function InputMarksPage() {
  const [selectedClass, setSelectedClass] = useState("Class 8");
  const [selectedExam, setSelectedExam] = useState("Midterm");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [hasExistingData, setHasExistingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ডাটা ফেচ করা
  const fetchData = async () => {
    setLoading(true);
    try {
      const studentRes = await fetch(`http://localhost:5000/api/admin/students?classId=${selectedClass}`);
      const studentData = await studentRes.json();

      const marksRes = await fetch(
        `http://localhost:5000/api/teacher/marks?classId=${selectedClass}&examType=${selectedExam}&subjectName=${selectedSubject}`
      );
      const existingMarksData = await marksRes.json();

      if (studentData.success) {
        const filteredStudents = (studentData.students || []).filter((std) => {
          const studentClass = std.classId || std.class;
          return studentClass === selectedClass;
        });

        setStudents(filteredStudents);

        const marksMap = {};
        if (existingMarksData.success && existingMarksData.marks?.length > 0) {
          existingMarksData.marks.forEach((m) => {
            marksMap[m.studentId] = m.obtainedMarks;
          });
          setHasExistingData(true);
        } else {
          setHasExistingData(false);
        }
        setMarksData(marksMap);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClass, selectedExam, selectedSubject]);

  const handleMarkChange = (studentId, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSubmitMarks = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedMarks = students.map((std) => ({
      studentId: std._id,
      studentName: std.name,
      roll: std.roll || "N/A",
      obtainedMarks: marksData[std._id] !== undefined && marksData[std._id] !== "" 
        ? Number(marksData[std._id]) 
        : 0
    }));

    const payload = {
      classId: selectedClass,
      examType: selectedExam,
      subjectName: selectedSubject,
      teacherEmail: "teacher@school.com",
      marks: formattedMarks
    };

    try {
      const res = await fetch("http://localhost:5000/api/teacher/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        alert(hasExistingData ? "Marks updated successfully!" : "Marks saved successfully!");
        setHasExistingData(true);
      } else {
        alert(data.message || "Failed to save marks.");
      }
    } catch (err) {
      alert("Server error while saving marks.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMarks = async () => {
    if (!confirm(`Are you sure you want to delete marks for ${selectedClass} - ${selectedSubject} (${selectedExam})?`)) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/teacher/marks?classId=${selectedClass}&examType=${selectedExam}&subjectName=${selectedSubject}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.success) {
        alert("Marks deleted successfully!");
        setMarksData({});
        setHasExistingData(false);
      } else {
        alert(data.message || "Failed to delete marks.");
      }
    } catch (err) {
      alert("Server error while deleting marks.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-2 sm:p-4 pb-12">
      {/* Header */}
      <div className="bg-base-100 border border-base-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
              <FiFileText className="text-primary shrink-0" /> Student Marks Entry
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Select class, exam type, and subject to manage student scores seamlessly.
            </p>
          </div>
          {hasExistingData ? (
            <span className="self-start sm:self-auto badge badge-success text-white text-xs py-3 px-3 font-medium flex items-center gap-1.5 shadow-xs">
              <FiEdit3 size={13} /> Edit Mode Active
            </span>
          ) : (
            <span className="self-start sm:self-auto badge badge-ghost text-xs py-3 px-3 font-medium flex items-center gap-1.5 border border-base-300">
              <FiCheckCircle size={13} /> New Entry Mode
            </span>
          )}
        </div>
      </div>

      {/* Control / Selection Filters */}
      <div className="bg-base-100 border border-base-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <h2 className="text-xs font-bold text-base-content/70 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FiLayers className="text-primary" /> Filter Options
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Class Select */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold text-base-content/70 flex items-center gap-1">
                <FiLayers size={13} /> Class
              </span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
            >
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>

          {/* Exam Select */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold text-base-content/70 flex items-center gap-1">
                <FiAward size={13} /> Exam Type
              </span>
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
            >
              <option value="First Term">First Term</option>
              <option value="Midterm">Midterm</option>
              <option value="Final Exam">Final Exam</option>
            </select>
          </div>

          {/* Subject Select */}
          <div className="form-control w-full sm:col-span-2 md:col-span-1">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold text-base-content/70 flex items-center gap-1">
                <FiBook size={13} /> Subject
              </span>
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Bangla">Bangla</option>
              <option value="Science">Science</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-base-100 border border-base-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Banner Summary */}
        <div className="p-4 sm:p-5 border-b border-base-200 bg-base-200/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-base-content flex items-center flex-wrap gap-1.5">
              <span>{selectedClass}</span> 
              <span className="text-base-content/40">•</span> 
              <span className="text-primary">{selectedSubject}</span>
              <span className="text-base-content/40">•</span> 
              <span className="text-xs font-normal text-base-content/70">({selectedExam})</span>
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Total Enrolled Students: <span className="font-semibold text-base-content">{students.length}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-base-content/50 gap-2">
            <span className="loading loading-spinner text-primary loading-md"></span>
            <span className="text-xs font-medium">Fetching student list...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 px-4 text-base-content/60 text-sm">
            No students found enrolled in <span className="font-semibold text-base-content">{selectedClass}</span>.
          </div>
        ) : (
          <form onSubmit={handleSubmitMarks}>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-base-200 bg-base-200/50 text-xs text-base-content/70 uppercase">
                    <th className="w-24 py-3.5">Roll</th>
                    <th className="py-3.5">Student Info</th>
                    <th className="w-56 text-right py-3.5">Obtained Marks (out of 100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200/60">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-base-200/30 transition-colors">
                      <td className="font-bold text-xs text-base-content/70">
                        #{student.studentId || "N/A"}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            <FiUser size={16} />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-base-content">{student.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="badge badge-xs bg-base-200 text-base-content/80 font-medium border-0">
                                {student.classId || student.class || selectedClass}
                              </span>
                              {student.group && (
                                <span className="badge badge-xs border border-base-300 text-base-content/70 font-medium bg-transparent">
                                  {student.group}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          value={marksData[student._id] !== undefined ? marksData[student._id] : ""}
                          onChange={(e) => handleMarkChange(student._id, e.target.value)}
                          className="input input-bordered input-sm rounded-xl w-32 text-center font-bold text-primary focus:outline-none focus:border-primary"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-base-200">
              {students.map((student) => (
                <div key={student._id} className="p-4 space-y-3 bg-base-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        <FiUser size={14} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-base-content">{student.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-base-content/60 flex items-center gap-0.5">
                            <FiHash size={10} /> Roll: <span className="font-semibold text-base-content">{student.roll || student.studentId || "N/A"}</span>
                          </span>
                          <span className="badge badge-xs bg-base-200 text-base-content/80 font-medium border-0">
                            {student.classId || student.class || selectedClass}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-base-200/40 p-2.5 rounded-xl border border-base-200">
                    <span className="text-xs font-medium text-base-content/70">Obtained Marks:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={marksData[student._id] !== undefined ? marksData[student._id] : ""}
                      onChange={(e) => handleMarkChange(student._id, e.target.value)}
                      className="input input-bordered input-sm rounded-lg w-28 text-center font-bold text-primary focus:outline-none focus:border-primary bg-base-100"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-base-200 bg-base-100/90 backdrop-blur-md sticky bottom-0 z-10 flex items-center justify-between gap-2">
              {hasExistingData ? (
                <button
                  type="button"
                  onClick={handleDeleteMarks}
                  disabled={isSubmitting}
                  className="btn btn-error btn-outline btn-sm rounded-xl flex items-center gap-1.5 text-xs font-semibold"
                >
                  <FiTrash2 size={14} /> <span className="hidden sm:inline">Clear Marks</span>
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-sm rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/20 text-xs font-semibold ml-auto"
              >
                <FiSave size={14} />
                {isSubmitting
                  ? "Saving..."
                  : hasExistingData
                  ? "Update Marks"
                  : "Save Marks"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}