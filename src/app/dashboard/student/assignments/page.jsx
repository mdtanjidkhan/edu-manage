"use client";
import { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { FiBookOpen, FiClock, FiCheckCircle, FiAlertCircle, FiSend, FiX, FiLink, FiFileText } from "react-icons/fi";

export default function StudentAssignmentsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Submission Form State
  const [submissionText, setSubmissionText] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const fetchAssignments = async () => {
    if (!session?.user?.email) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/student/assignments?email=${session.user.email}`
      );
      const result = await res.json();
      if (result.success) setAssignments(result.data);
    } catch (err) {
      console.error("Fetch Student Assignments Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [session?.user?.email]);

  const handleOpenSubmitModal = (item) => {
    setSelectedAssignment(item);
    setSubmissionText(item.submission?.submissionText || "");
    setFileUrl(item.submission?.fileUrl || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
       const { data: tokenData,error: tokenError } = await authClient.token();
      const res = await fetch("http://localhost:5000/api/student/assignments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json",
           authorization: `Bearer ${tokenData?.token}` },
        body: JSON.stringify({
          assignmentId: selectedAssignment.id,
          studentEmail: session?.user?.email,
          submissionText,
          fileUrl
        })
      });

      const result = await res.json();
      if (result.success) {
        setSelectedAssignment(null);
        setSubmissionText("");
        setFileUrl("");
        fetchAssignments();
      }
    } catch (err) {
      console.error("Submit Assignment Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Submitted":
        return <span className="badge badge-success gap-1 text-[11px] font-semibold"><FiCheckCircle /> Submitted</span>;
      case "Late":
        return <span className="badge badge-warning gap-1 text-[11px] font-semibold"><FiAlertCircle /> Submitted Late</span>;
      case "Completed":
        return <span className="badge badge-info gap-1 text-[11px] font-semibold"><FiCheckCircle /> Evaluated</span>;
      default:
        return <span className="badge badge-error gap-1 text-[11px] font-semibold"><FiClock /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="bg-base-100 border border-base-200 p-5 rounded-3xl shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
          <FiBookOpen className="text-primary" /> My Assignments
        </h1>
        <p className="text-xs text-base-content/60 mt-1">
          View assigned coursework and submit your answers before the deadline.
        </p>
      </div>

      {/* Assignments List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <span className="loading loading-spinner text-primary loading-lg"></span>
          <p className="text-sm text-base-content/60 font-medium">Loading Assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-3xl p-10 text-center text-base-content/60 space-y-2">
          <div className="p-3 bg-base-200/50 rounded-full w-fit mx-auto text-base-content/40">
            <FiBookOpen size={28} />
          </div>
          <p className="text-sm font-medium">No pending assignments for your class.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((item) => (
            <div
              key={item.id}
              className="bg-base-100 border border-base-200 rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-primary">{item.subject}</span>
                  {getStatusBadge(item.status)}
                </div>

                <h3 className="font-bold text-base text-base-content">{item.title}</h3>
                <p className="text-xs text-base-content/60">Teacher: <span className="font-semibold text-base-content">{item.teacherName}</span></p>
                <p className="text-xs text-base-content/70 line-clamp-3">{item.description}</p>
              </div>

              <div className="border-t border-base-200 pt-3 flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 text-base-content/60">
                  <FiClock className="text-error" />
                  Due: {new Date(item.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>

                <button
                  onClick={() => handleOpenSubmitModal(item)}
                  className="btn btn-primary btn-xs rounded-xl font-semibold flex items-center gap-1"
                >
                  <FiSend size={12} /> {item.submission ? "Resubmit" : "Submit"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Assignment Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-200 w-full max-w-lg rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-base-200 pb-3">
              <div>
                <h2 className="font-bold text-lg text-base-content">Submit Assignment</h2>
                <p className="text-xs text-primary font-medium">{selectedAssignment.title}</p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1 hover:bg-base-200 rounded-full transition-all"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-base-content/70 flex items-center gap-1">
                  <FiFileText /> Written Answer / Notes
                </label>
                <textarea
                  rows="4"
                  required={!fileUrl}
                  placeholder="Write your answer or instructions here..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="textarea textarea-bordered w-full rounded-2xl mt-1 text-xs"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70 flex items-center gap-1">
                  <FiLink /> Attachment Drive Link (Google Drive / PDF Link)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-2xl mt-1 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="btn btn-sm btn-ghost rounded-2xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-sm btn-primary rounded-2xl text-xs font-semibold flex items-center gap-1"
                >
                  {submitting ? "Submitting..." : <><FiSend size={14} /> Submit Work</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}