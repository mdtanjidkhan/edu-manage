"use client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { 
  FiBell, 
  FiPlus, 
  FiTrash2, 
  FiCalendar, 
  FiUsers, 
  FiCheckCircle, 
  FiEdit3, 
  FiX 
} from "react-icons/fi";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [editingId, setEditingId] = useState(null); // Track notice being edited

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "All",
    category: "General"
  });

  // Fetch Notices
  const fetchNotices = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/notices`);
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices || []);
      }
    } catch (err) {
      console.error("Failed to fetch notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Set form data for Editing
  const handleEditClick = (notice) => {
    setEditingId(notice._id);
    setFormData({
      title: notice.title,
      description: notice.description,
      targetAudience: notice.targetAudience,
      category: notice.category
    });
  };

  // Cancel Editing Mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", targetAudience: "All", category: "General" });
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const isEdit = !!editingId;
    const url = isEdit 
      ? `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/notices/${editingId}`
      : `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/notices`;
    const method = isEdit ? "PATCH" : "POST";

    try {
       const { data: tokenData,error: tokenError } = await authClient.token();
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json",
           authorization: `Bearer ${tokenData?.token}`
         },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        handleCancelEdit();
        setToastMsg(isEdit ? "Notice updated successfully!" : "Notice published successfully!");
        setTimeout(() => setToastMsg(""), 3000);
        fetchNotices();
      }
    } catch (err) {
      console.error("Error saving notice:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Notice
  const handleDelete = async (id) => {
    // if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
       const { data: tokenData,error: tokenError } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/notices/${id}`, {
        method: "DELETE",
         headers: { "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
          },
      });
      const data = await res.json();
      if (data.success) {
        fetchNotices();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success text-white shadow-lg rounded-xl flex items-center gap-2">
            <FiCheckCircle size={18} />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2.5">
          <FiBell className="text-primary" /> Notice Board Management
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1">
          Publish and manage official announcements for students, teachers, and staff.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create/Edit Notice Form */}
        <div className="lg:col-span-1">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs sticky top-6 space-y-4">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h2 className="text-base font-bold text-base-content flex items-center gap-2">
                {editingId ? <FiEdit3 className="text-warning" /> : <FiPlus className="text-primary" />} 
                {editingId ? "Edit Notice" : "Publish New Notice"}
              </h2>
              {editingId && (
                <button 
                  onClick={handleCancelEdit}
                  className="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content flex items-center gap-1"
                >
                  <FiX size={14} /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Term Exam Schedule"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam Schedule</option>
                  <option value="Holiday">Holiday Notice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
                >
                  <option value="All">All (Everyone)</option>
                  <option value="Students">Students Only</option>
                  <option value="Teachers">Teachers Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">Description</label>
                <textarea
                  rows={4}
                  placeholder="Write the full notice description here..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea textarea-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`btn w-full rounded-xl gap-2 ${editingId ? "btn-warning text-white" : "btn-primary"}`}
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : editingId ? (
                  <>
                    <FiEdit3 size={18} /> Update Notice
                  </>
                ) : (
                  <>
                    <FiBell size={18} /> Publish Notice
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Active Notices List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-base-content flex items-center justify-between">
            <span>Published Announcements</span>
            <span className="badge badge-neutral badge-sm">{notices.length} Total</span>
          </h2>

          {loading ? (
            <div className="flex justify-center p-12 bg-base-100 border border-base-300 rounded-2xl">
              <span className="loading loading-spinner text-primary"></span>
            </div>
          ) : notices.length === 0 ? (
            <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center text-base-content/60 space-y-2">
              <FiBell size={32} className="mx-auto text-base-content/30" />
              <p className="font-semibold text-sm">No notices published yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => (
                <div 
                  key={notice._id}
                  className={`bg-base-100 border rounded-2xl p-5 shadow-xs space-y-3 transition-colors ${
                    editingId === notice._id ? "border-warning bg-warning/5" : "border-base-300 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="badge badge-primary badge-sm font-semibold">
                          {notice.category}
                        </span>
                        <span className="badge badge-ghost badge-sm text-xs flex items-center gap-1">
                          <FiUsers size={12} /> {notice.targetAudience}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-base-content">{notice.title}</h3>
                    </div>

                    {/* Action Buttons: Edit & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(notice)}
                        className="btn btn-ghost btn-xs text-info hover:bg-info/10 rounded-lg p-1"
                        title="Edit Notice"
                      >
                        <FiEdit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-lg p-1"
                        title="Delete Notice"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-base-content/80 whitespace-pre-line leading-relaxed">
                    {notice.description}
                  </p>

                  <div className="text-xs text-base-content/50 pt-2 border-t border-base-200 flex items-center gap-1">
                    <FiCalendar size={12} /> Published on: {notice.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}