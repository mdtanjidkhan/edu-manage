
"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { FiPlus, FiBookOpen, FiClock, FiTrash2, FiEdit2, FiUsers, FiX } from "react-icons/fi";

const classesList = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const groupOptions = ["Science", "Humanities", "Business Studies"];

export default function TeacherAssignmentsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track Edit ID

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

  // Open Modal for New Assignment
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

  // Open Modal for Edit Assignment
  const handleOpenEditModal = (item) => {
    setEditingId(item.id);

    // Format deadline to ISO string format for datetime-local input
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

  // Submit Handler for Create OR Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const url = editingId
      ? `http://localhost:5000/api/teacher/assignments/${editingId}`
      : "http://localhost:5000/api/teacher/assignments";

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
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
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/teacher/assignments/${id}`, {
        method: "DELETE"
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
            Create, update and manage assignments for your classes.
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
                  
                  {/* Action Buttons: Edit & Delete */}
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

              <div className="border-t border-base-200 pt-3 flex justify-between items-center text-xs text-base-content/60">
                <span className="flex items-center gap-1">
                  <FiClock className="text-error" />
                  Due: {new Date(item.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="flex items-center gap-1 font-semibold text-base-content">
                  <FiUsers className="text-primary" /> {item.totalSubmissions} Submissions
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit Assignment */}
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