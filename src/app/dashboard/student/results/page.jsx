"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { FiAward, FiBookOpen, FiFileText } from "react-icons/fi";

export default function StudentResultsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [resultsData, setResultsData] = useState(null);
  const [selectedExam, setSelectedExam] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/student/results?email=${session.user.email}`
        );
        const result = await res.json();
        if (result.success) {
          setResultsData(result.data);
          if (result.data.examResults?.length > 0) {
            setSelectedExam(result.data.examResults[0].examName);
          }
        }
      } catch (err) {
        console.error("Results Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [session?.user?.email]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <span className="loading loading-spinner text-primary loading-lg"></span>
        <p className="text-sm text-base-content/60 font-medium">Loading Academic Results...</p>
      </div>
    );
  }

  const { className, examResults = [] } = resultsData || {};
  const currentExam = examResults.find((e) => e.examName === selectedExam) || examResults[0];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 border border-base-200 p-5 rounded-3xl shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
            <FiAward className="text-primary" /> Examination Results
          </h1>
          <p className="text-xs text-base-content/60 mt-1">Class: <span className="font-semibold text-base-content">{className}</span></p>
        </div>

        {/* Term Dropdown */}
        {examResults.length > 0 && (
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="select select-sm select-bordered rounded-2xl text-xs font-semibold"
          >
            {examResults.map((e) => (
              <option key={e.examName} value={e.examName}>
                {e.examName}
              </option>
            ))}
          </select>
        )}
      </div>

      {examResults.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-3xl p-8 text-center text-base-content/60 space-y-2">
          <div className="p-3 bg-base-200/50 rounded-full w-fit mx-auto text-base-content/40">
            <FiFileText size={24} />
          </div>
          <p className="text-sm font-medium">No published exam results found yet!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* GPA Card */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 rounded-3xl flex justify-between items-center">
            <div>
              <p className="text-xs text-base-content/60 font-medium">Result Performance</p>
              <h2 className="text-xl font-bold text-base-content mt-0.5">{currentExam?.examName}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-base-content/60 font-medium">GPA</p>
              <span className="text-2xl font-black text-primary">{currentExam?.gpa}</span>
            </div>
          </div>

          {/* Subject Marks Table */}
          <div className="bg-base-100 border border-base-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-base-content flex items-center gap-2">
              <FiBookOpen className="text-primary" /> Subject Grade Sheet
            </h3>

            <div className="overflow-x-auto">
              <table className="table w-full text-xs">
                <thead>
                  <tr className="border-base-200 text-base-content/60">
                    <th>Subject</th>
                    <th>Obtained Marks</th>
                    <th>Total Marks</th>
                    <th>Grade</th>
                    <th>GPA Point</th>
                  </tr>
                </thead>
                <tbody>
                  {currentExam?.subjects.map((sub) => (
                    <tr key={sub.id} className="border-base-200 hover:bg-base-200/40">
                      <td className="font-bold text-base-content">{sub.subjectName}</td>
                      <td className="font-semibold text-primary">{sub.obtainedMarks}</td>
                      <td className="text-base-content/70">{sub.totalMarks}</td>
                      <td>
                        <span className={`px-2.5 py-1 rounded-xl font-bold text-[11px] ${
                          sub.grade === "F" ? "bg-error/10 text-error" : "bg-success/10 text-success"
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="font-semibold">{sub.point.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}