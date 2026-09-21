
"use client";
import { useState, useEffect } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { 
  FiPlus, FiBookOpen, FiClock, FiTrash2, FiEdit2, 
  FiUsers, FiX, FiEye, FiExternalLink, FiFileText 
} from "react-icons/fi";

const classesList = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const groupOptions = ["Science", "Humanities", "Business Studies"];

export default function TeacherAssignmentsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assignments, setAssignments] = useState([]);
  
  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Submissions Modal State
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [selectedAssignmentTitle, setSelectedAssignmentTitle] = useState("");
  const [submissionsList, setSubmissionsList] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [activeSubmissionDetails, setActiveSubmissionDetails] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    classId: "Class 9",
    group: "Science",
    deadline: "",
    description: ""
  });

  const fetchAssignments = async () => {
    if (!session?.user?.email) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/teacher/assignments?teacherEmail=${session.user.email}`
      );
      const result = await res.json();
      if (result.success) setAssignments(result.data);
    } catch (err) {
      console.error("Fetch Assignments Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [session?.user?.email]);

  // Open Submissions List Modal
  const handleViewSubmissions = async (assignment) => {
    setSelectedAssignmentTitle(assignment.title);
    setIsSubmissionModalOpen(true);
    setLoadingSubmissions(true);
    setActiveSubmissionDetails(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/teacher/assignments/${assignment.id}/submissions`
      );
      const result = await res.json();
      if (result.success) setSubmissionsList(result.data);
    } catch (err) {
      console.error("Fetch Submissions Error:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      subject: "",
      classId: "Class 9",
      group: "Science",
      deadline: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    const formattedDeadline = item.deadline
      ? new Date(item.deadline).toISOString().slice(0, 16)
      : "";

    setFormData({
      title: item.title,
      subject: item.subject,
      classId: item.classId,
      group: item.group || "General",
      deadline: formattedDeadline,
      description: item.description || ""
    });
    setIsModalOpen(true);
  };

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    const isHigherClass = selectedClass === "Class 9" || selectedClass === "Class 10";

    setFormData((prev) => ({
      ...prev,
      classId: selectedClass,
      group: isHigherClass ? "Science" : "General"
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const url = editingId
      ? `http://localhost:5000/api/teacher/assignments/${editingId}`
      : "http://localhost:5000/api/teacher/assignments";

    const method = editingId ? "PUT" : "POST";

    try {
       const { data: tokenData,error: tokenError } = await authClient.token();
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json",
           authorization: `Bearer ${tokenData?.token}`
         },
        body: JSON.stringify({
          ...formData,
          teacherEmail: session?.user?.email,
          teacherName: session?.user?.name || "Teacher"
        })
      });

      const result = await res.json();
      if (result.success) {
        setIsModalOpen(false);
        fetchAssignments();
      }
    } catch (err) {
      console.error("Save Assignment Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    // if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
       const { data: tokenData,error: tokenError } = await authClient.token();
      const res = await fetch(`http://localhost:5000/api/teacher/assignments/${id}`, {
        method: "DELETE",
         headers: { "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
          },
      });
      const result = await res.json();
      if (result.success) fetchAssignments();
    } catch (err) {
      console.error("Delete Assignment Error:", err);
    }
  };

  const showGroupSelect = formData.classId === "Class 9" || formData.classId === "Class 10";

  return (
    <div className="space-y-6 pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 border border-base-200 p-5 rounded-3xl shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
            <FiBookOpen className="text-primary" /> Manage Assignments
          </h1>
          <p className="text-xs text-base-content/60 mt-1">
            Create, update and inspect student submitted assignments.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="btn btn-primary btn-sm rounded-2xl flex items-center gap-1.5 font-semibold"
        >
          <FiPlus size={16} /> Create Assignment
        </button>
      </div>

      {/* Assignments Grid */}
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
          <p className="text-sm font-medium">No assignments published yet.</p>
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
                  <span className="text-xs font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-xl">
                    {item.classId} {item.group !== "General" && `(${item.group})`}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="text-primary hover:bg-primary/10 p-1.5 rounded-xl transition-all"
                      title="Edit Assignment"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-error hover:bg-error/10 p-1.5 rounded-xl transition-all"
                      title="Delete Assignment"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-base-content">{item.title}</h3>
                <p className="text-xs font-medium text-primary">{item.subject}</p>
                <p className="text-xs text-base-content/70 line-clamp-2">{item.description}</p>
              </div>

              <div className="border-t border-base-200 pt-3 flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 text-base-content/60">
                  <FiClock className="text-error" />
                  Due: {new Date(item.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>

                <button
                  onClick={() => handleViewSubmissions(item)}
                  className="btn btn-outline btn-primary btn-xs rounded-xl font-semibold flex items-center gap-1"
                >
                  <FiUsers size={12} /> {item.totalSubmissions} Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Submissions View Modal */}
      {isSubmissionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-200 w-full max-w-2xl rounded-3xl p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-base-200 pb-3">
              <div>
                <h2 className="font-bold text-lg text-base-content">Student Submissions</h2>
                <p className="text-xs text-primary font-semibold">{selectedAssignmentTitle}</p>
              </div>
              <button
                onClick={() => setIsSubmissionModalOpen(false)}
                className="p-1 hover:bg-base-200 rounded-full transition-all"
              >
                <FiX size={18} />
              </button>
            </div>

            {loadingSubmissions ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span className="loading loading-spinner text-primary loading-md"></span>
                <p className="text-xs text-base-content/60">Loading Submissions...</p>
              </div>
            ) : submissionsList.length === 0 ? (
              <div className="text-center py-8 text-base-content/60 space-y-1">
                <FiFileText size={24} className="mx-auto text-base-content/40" />
                <p className="text-sm font-medium">No students have submitted this assignment yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="table table-xs w-full">
                    <thead>
                      <tr className="border-base-200 text-base-content/60">
                        <th>Student Name</th>
                        <th>Submitted At</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissionsList.map((sub) => (
                        <tr key={sub._id} className="border-base-200 hover:bg-base-200/30">
                          <td className="font-bold text-base-content">
                            {sub.studentName}
                            <span className="block text-[10px] font-normal text-base-content/60">{sub.studentEmail}</span>
                            <span className="block text-[10px] font-normal text-base-content/60 mt-1">Roll No:{sub.studentId}</span>
                          </td>
                          <td className="text-base-content/70">
                            {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td>
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              sub.status === "Late" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                            }`}>
                              {sub.status || "Submitted"}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => setActiveSubmissionDetails(sub)}
                              className="btn btn-ghost btn-xs text-primary gap-1"
                            >
                              <FiEye size={12} /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Detailed View Modal Box for Selected Student */}
                {activeSubmissionDetails && (
                  <div className="bg-base-200/50 border border-base-200 p-4 rounded-2xl space-y-3 mt-4">
                    <div className="flex justify-between items-center border-b border-base-200 pb-2">
                      <h4 className="font-bold text-xs text-base-content">
                        Submission Details: <span className="text-primary">{activeSubmissionDetails.studentName}</span>
                      </h4>
                      <button
                        onClick={() => setActiveSubmissionDetails(null)}
                        className="text-xs text-error font-semibold hover:underline"
                      >
                        Close Details
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-base-content/70">Submitted Text / Notes:</span>
                        <p className="bg-base-100 p-3 rounded-xl border border-base-200 mt-1 whitespace-pre-wrap text-base-content">
                          {activeSubmissionDetails.submissionText || "No text provided."}
                        </p>
                      </div>

                      {activeSubmissionDetails.fileUrl && (
                        <div>
                          <span className="font-semibold text-base-content/70">Attached Link:</span>
                          <a
                            href={activeSubmissionDetails.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-primary hover:underline mt-1 font-semibold break-all"
                          >
                            <FiExternalLink /> {activeSubmissionDetails.fileUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 2: Create / Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-base-100 border border-base-200 w-full max-w-lg rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-base-200 pb-3">
              <h2 className="font-bold text-lg text-base-content">
                {editingId ? "Edit Assignment" : "Create New Assignment"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-base-200 rounded-full transition-all"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-base-content/70">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Chapter 3 Motion Sheet"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-2xl mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-2xl mt-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-base-content/70">Class</label>
                  <select
                    value={formData.classId}
                    onChange={handleClassChange}
                    className="select select-sm select-bordered w-full rounded-2xl mt-1 text-xs"
                  >
                    {classesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {showGroupSelect ? (
                  <div>
                    <label className="text-xs font-semibold text-base-content/70">Group</label>
                    <select
                      value={formData.group}
                      onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                      className="select select-sm select-bordered w-full rounded-2xl mt-1 text-xs"
                    >
                      {groupOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-base-content/70">Group</label>
                    <input
                      type="text"
                      disabled
                      value="General"
                      className="input input-sm input-bordered w-full rounded-2xl mt-1 text-xs bg-base-200 text-base-content/50"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70">Deadline Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-2xl mt-1 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70">Instructions / Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide instructions for the students..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea textarea-bordered w-full rounded-2xl mt-1 text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-sm btn-ghost rounded-2xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-sm btn-primary rounded-2xl text-xs font-semibold"
                >
                  {submitting ? "Saving..." : editingId ? "Update Assignment" : "Publish Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}