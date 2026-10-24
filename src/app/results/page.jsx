"use client";

import { useState } from "react";
import { 
  FiAward, 
  FiSearch, 
  FiPrinter, 
  FiUser, 
  FiBookOpen, 
  FiCheckCircle,
  FiFileText,
  FiXCircle
} from "react-icons/fi";

export default function ResultsPage() {
  const [classId, setClassId] = useState("Class 6");
  const [examType, setExamType] = useState("Final Exam");
  const [roll, setRoll] = useState("");
  
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!roll.trim()) {
      setErrorMsg("Please enter Student Roll or ID");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setResultData(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/results?classId=${encodeURIComponent(classId)}&examType=${encodeURIComponent(examType)}&roll=${encodeURIComponent(roll)}`
      );
      const data = await res.json();

      if (data.success) {
        setResultData(data.data);
      } else {
        setErrorMsg(data.message || "No result found.");
      }
    } catch (err) {
      setErrorMsg("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Grade Calculator Helper
  const getGrade = (marks) => {
    if (marks >= 80) return { grade: "A+", point: "5.00", badge: "badge-success" };
    if (marks >= 70) return { grade: "A", point: "4.00", badge: "badge-success" };
    if (marks >= 60) return { grade: "A-", point: "3.50", badge: "badge-info" };
    if (marks >= 50) return { grade: "B", point: "3.00", badge: "badge-info" };
    if (marks >= 40) return { grade: "C", point: "2.00", badge: "badge-warning" };
    if (marks >= 33) return { grade: "D", point: "1.00", badge: "badge-warning" };
    return { grade: "F", point: "0.00", badge: "badge-error" };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-base-200/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <span className="badge badge-primary badge-outline text-xs font-bold px-3 py-2">
            Academic Result Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content flex items-center justify-center gap-2">
            <FiAward className="text-primary" /> Examination Results
          </h1>
          <p className="text-xs sm:text-sm text-base-content/70">
            Search and download official academic marksheets.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Class Select */}
              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1.5 block">Select Class</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="select select-bordered w-full rounded-xl text-sm focus:outline-primary"
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>

              {/* Exam Type Select */}
              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1.5 block">Exam Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="select select-bordered w-full rounded-xl text-sm focus:outline-primary"
                >
                  <option value="Final Exam">Final Exam</option>
                  <option value="Mid-Term Exam">Midterm</option>
                  <option value="1st Tutorial">1st Tutorial</option>
                </select>
              </div>

              {/* Roll / Student ID */}
              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1.5 block">Roll / Student ID</label>
                <input
                  type="text"
                  placeholder="e.g. 780"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  className="input input-bordered w-full rounded-xl text-sm focus:outline-primary"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-xl text-sm font-semibold gap-2 shadow-md shadow-primary/20"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <FiSearch size={16} /> Search Result
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="alert alert-error text-xs rounded-xl mt-4 flex items-center gap-2">
              <FiXCircle size={16} /> {errorMsg}
            </div>
          )}
        </div>

        {/* Marksheet Display */}
        {resultData && (
          <div className="bg-base-100 border border-base-300 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-base-200 pb-4">
              <div className="flex items-center gap-2">
                <FiFileText className="text-primary" size={20} />
                <h3 className="font-bold text-base sm:text-lg text-base-content">Official Marksheet</h3>
              </div>
              <button
                onClick={handlePrint}
                className="btn btn-primary btn-outline btn-sm rounded-xl gap-2 text-xs font-semibold"
              >
                <FiPrinter size={15} /> Print Marksheet
              </button>
            </div>

            {/* Student Details Card */}
            <div className="bg-base-200/50 rounded-2xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-base-content/50 uppercase font-bold text-[10px]">Student Name</p>
                <p className="font-extrabold text-sm text-base-content mt-0.5">{resultData.studentName}</p>
              </div>
              <div>
                <p className="text-base-content/50 uppercase font-bold text-[10px]">Roll No / ID</p>
                <p className="font-bold text-sm text-base-content mt-0.5">{resultData.roll}</p>
              </div>
              <div>
                <p className="text-base-content/50 uppercase font-bold text-[10px]">Class</p>
                <p className="font-bold text-sm text-base-content mt-0.5">{resultData.classId}</p>
              </div>
              <div>
                <p className="text-base-content/50 uppercase font-bold text-[10px]">Exam Name</p>
                <p className="font-bold text-sm text-primary mt-0.5">{resultData.examType}</p>
              </div>
            </div>

            {/* Marks Table */}
            <div className="overflow-x-auto border border-base-200 rounded-2xl">
              <table className="table w-full text-sm">
                <thead className="bg-base-200/60 text-xs text-base-content/70 uppercase">
                  <tr>
                    <th>Subject Name</th>
                    <th>Full Marks</th>
                    <th>Obtained Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {resultData.subjects?.map((sub, idx) => {
                    const gradeInfo = getGrade(sub.obtainedMarks);
                    return (
                      <tr key={idx} className="hover:bg-base-200/30">
                        <td className="font-bold text-base-content">{sub.subjectName}</td>
                        <td>100</td>
                        <td className="font-bold text-primary">{sub.obtainedMarks}</td>
                        <td>
                          <span className={`badge badge-sm font-bold text-white ${gradeInfo.badge}`}>
                            {gradeInfo.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Overall Total Summary */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/70 font-medium">Total Marks Obtained</p>
                <p className="text-2xl font-black text-primary">{resultData.totalMarks}</p>
              </div>
              <div className="text-right">
                <span className="badge badge-success text-white font-bold px-3 py-1 text-xs">
                  PASSED
                </span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}