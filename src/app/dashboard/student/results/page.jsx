
"use client";
import { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { FiAward, FiBookOpen, FiFileText, FiPrinter, FiUser, FiLayers } from "react-icons/fi";

export default function StudentResultsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [resultsData, setResultsData] = useState(null);
  const [selectedExam, setSelectedExam] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!session?.user?.email) return;

      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/student/results?email=${session.user.email}`,
          {
            headers: {
              authorization: `Bearer ${tokenData?.token}`
            }
          }
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

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <span className="loading loading-spinner text-primary loading-lg"></span>
        <p className="text-sm text-base-content/60 font-medium">Loading Academic Marksheet...</p>
      </div>
    );
  }

  const { className, examResults = [] } = resultsData || {};
  const currentExam = examResults.find((e) => e.examName === selectedExam) || examResults[0];

  // মোট প্রাপ্ত নম্বর ও সর্বোচ্চ নম্বরের হিসাব
  const totalObtained = currentExam?.subjects?.reduce((acc, sub) => acc + sub.obtainedMarks, 0) || 0;
  const totalPossible = currentExam?.subjects?.reduce((acc, sub) => acc + sub.totalMarks, 0) || 0;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Header & Controls (Hidden during print) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 border border-base-200 p-5 rounded-3xl shadow-xs print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
            <FiAward className="text-primary shrink-0" /> Student Academic Marksheet
          </h1>
          <p className="text-xs text-base-content/60 mt-1">
            Official term examination report card and grade sheet.
          </p>
        </div>

        {examResults.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="select select-sm select-bordered rounded-2xl text-xs font-semibold focus:outline-none focus:border-primary"
            >
              {examResults.map((e) => (
                <option key={e.examName} value={e.examName}>
                  {e.examName}
                </option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="btn btn-sm btn-primary rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-primary/20"
            >
              <FiPrinter size={14} /> Print Marksheet
            </button>
          </div>
        )}
      </div>

      {examResults.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-3xl p-12 text-center text-base-content/60 space-y-3">
          <div className="p-4 bg-base-200/50 rounded-full w-fit mx-auto text-base-content/40">
            <FiFileText size={32} />
          </div>
          <h3 className="text-base font-bold text-base-content">No Published Results Found</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            Your term marksheet has not been published by the administration yet.
          </p>
        </div>
      ) : (
        /* Printable Marksheet Container */
        <div className="bg-base-100 border border-base-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:border-none">
          
          {/* School / Institution Header */}
          <div className="text-center border-b border-base-200 pb-5 space-y-1">
            <h2 className="text-2xl font-extrabold text-base-content tracking-tight">EDUMANAGE SCHOOL & COLLEGE</h2>
            <p className="text-xs text-base-content/60">Official Academic Transcript & Term Marksheet</p>
            <div className="badge badge-primary badge-outline text-xs mt-2 px-4 py-3 font-bold">
              {currentExam?.examName}
            </div>
          </div>

          {/* Student Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-base-200/40 p-4 rounded-2xl border border-base-200 text-xs">
            <div>
              <span className="text-base-content/60 block">Student Name</span>
              <span className="font-bold text-base-content text-sm">{session?.user?.name || "N/A"}</span>
            </div>
            <div>
              <span className="text-base-content/60 block">Email / ID</span>
              <span className="font-bold text-base-content">{session?.user?.email}</span>
            </div>
            <div>
              <span className="text-base-content/60 block">Class Enrolled</span>
              <span className="font-bold text-base-content">{className || "N/A"}</span>
            </div>
          </div>

          {/* Complete Subjects Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-base-content flex items-center gap-1.5 uppercase tracking-wider text-base-content/70">
              <FiBookOpen className="text-primary" /> Subject-wise Performance Summary
            </h3>

            <div className="overflow-x-auto">
              <table className="table w-full text-xs border border-base-200 rounded-xl">
                <thead>
                  <tr className="bg-base-200/60 text-base-content/70 uppercase border-b border-base-200">
                    <th className="py-3">Subject Name</th>
                    <th className="py-3 text-center">Obtained Marks</th>
                    <th className="py-3 text-center">Total Marks</th>
                    <th className="py-3 text-center">Letter Grade</th>
                    <th className="py-3 text-center">Grade Point (GPA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200/60">
                  {currentExam?.subjects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-base-200/30 transition-colors">
                      <td className="font-bold text-base-content">{sub.subjectName}</td>
                      <td className="text-center font-bold text-primary text-sm">{sub.obtainedMarks}</td>
                      <td className="text-center text-base-content/70">{sub.totalMarks}</td>
                      <td className="text-center">
                        <span className={`px-2.5 py-1 rounded-xl font-bold text-[11px] ${
                          sub.grade === "F" ? "bg-error/10 text-error" : "bg-success/10 text-success"
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="text-center font-semibold">{sub.point.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Result Summary & GPA Box */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-primary/5 border border-primary/20 p-5 rounded-2xl gap-4">
            <div>
              <p className="text-xs text-base-content/60 font-medium">Total Marks Obtained</p>
              <h4 className="text-lg font-extrabold text-base-content">
                {totalObtained} <span className="text-xs font-normal text-base-content/60">/ {totalPossible}</span>
              </h4>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs text-base-content/60 font-medium">Final Term GPA</p>
              <h3 className="text-2xl font-black text-primary">{currentExam?.gpa}</h3>
            </div>
          </div>

          {/* Signature Footer for Print */}
          <div className="pt-12 flex justify-between items-center text-xs text-base-content/70 border-t border-base-200 mt-8">
            <div className="text-center">
              <div className="w-32 border-b border-base-300 mb-1"></div>
              <span>Class Teacher Signature</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-base-300 mb-1"></div>
              <span>Principal Signature & Seal</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}


