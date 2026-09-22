"use client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { 
  FiUserCheck, 
  FiPlus, 
  FiSearch, 
  FiUser, 
  FiMail, 
  FiLock, 
  FiBookOpen, 
  FiBriefcase,
  FiX,
  FiEdit2,
  FiTrash2
} from "react-icons/fi";

export default function ManageTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "Assistant Teacher",
    subject: "Mathematics"
  });

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/teachers`);
      const data = await res.json();
      if (data.success) {
        setTeachers(data.teachers);
      }
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingTeacherId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      designation: "Assistant Teacher",
      subject: "Mathematics"
    });
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher) => {
    setIsEditMode(true);
    setEditingTeacherId(teacher._id);
    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      password: "",
      designation: teacher.designation || "Assistant Teacher",
      subject: teacher.subject || "Mathematics"
    });
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");

    const url = isEditMode 
      ? `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/teachers/${editingTeacherId}`
      : `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/teachers`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const { data: tokenData,error: tokenError } = await authClient.token();
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", authorization: `Bearer ${tokenData?.token}` },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setFormSuccess(isEditMode ? "Teacher updated successfully!" : "Teacher added successfully!");
        fetchTeachers();
        setTimeout(() => {
          setIsModalOpen(false);
          setFormSuccess("");
        }, 1000);
      } else {
        setFormError(data.message || "Operation failed.");
      }
    } catch (err) {
      setFormError("Server error. Please check Express backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async () => {
    if (!deleteCandidate) return;
    setIsSubmitting(true);

    try {
      const { data: tokenData,error: tokenError } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/teachers/${deleteCandidate._id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${tokenData?.token}` }
      });

      const data = await res.json();

      if (data.success) {
        setDeleteCandidate(null);
        fetchTeachers();
      } else {
        alert(data.message || "Failed to delete teacher.");
      }
    } catch (err) {
      alert("Server error while deleting teacher.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = 
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject === "All" || teacher.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2">
            <FiUserCheck className="text-secondary" /> Manage Teachers
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            View, add, edit, and manage faculty members.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn btn-secondary rounded-xl flex items-center gap-2 shadow-md shadow-secondary/20"
        >
          <FiPlus size={18} /> Add New Teacher
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 rounded-xl text-sm focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-base-content/60 uppercase whitespace-nowrap">
            Subject Filter:
          </span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="select select-bordered w-full md:w-56 rounded-xl text-sm focus:outline-none focus:border-secondary"
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

      {/* Teacher List Table */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <span className="loading loading-spinner loading-md text-secondary"></span>
            <p className="text-sm text-base-content/60">Fetching faculty records...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center p-12 text-base-content/60">
            No teachers found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70 text-xs font-semibold uppercase">
                <tr>
                  <th>Faculty Info</th>
                  <th>Designation</th>
                  <th>Subject</th>
                  <th>Joined Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-sm">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-base-200/30 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-secondary/10 text-secondary font-bold rounded-full w-10 h-10 flex items-center justify-center">
                            {teacher.name ? teacher.name.charAt(0).toUpperCase() : "T"}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-base-content">{teacher.name}</div>
                          <div className="text-xs text-base-content/60">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary badge-outline badge-sm font-semibold">
                        {teacher.designation || "Teacher"}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm font-medium">
                        {teacher.subject || "General"}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenEditModal(teacher)}
                          className="btn btn-ghost btn-xs text-secondary font-semibold"
                          title="Edit Teacher"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button 
                          onClick={() => setDeleteCandidate(teacher)}
                          className="btn btn-ghost btn-xs text-error font-semibold"
                          title="Delete Teacher"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT TEACHER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-base-100 rounded-2xl border border-base-300 w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-base-200">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <FiUserCheck className="text-secondary" /> {isEditMode ? "Edit Faculty Details" : "Add New Teacher"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {formError && <div className="alert alert-error text-xs p-3 rounded-xl">{formError}</div>}
              {formSuccess && <div className="alert alert-success text-xs p-3 rounded-xl text-white">{formSuccess}</div>}

              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Dr. Robiul Islam"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="teacher@edumanage.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {!isEditMode && (
                <div>
                  <label className="text-xs font-semibold text-base-content/70 mb-1 block">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="password"
                      name="password"
                      required={!isEditMode}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input input-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-base-content/70 mb-1 block">Designation</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="select select-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-secondary"
                    >
                      <option value="Assistant Teacher">Assistant Teacher</option>
                      <option value="Senior Teacher">Senior Teacher</option>
                      <option value="Head Teacher">Head Teacher</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-base-content/70 mb-1 block">Subject</label>
                  <div className="relative">
                    <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="select select-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-secondary"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="General Science">General Science</option>
                      <option value="English">English</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="ICT">ICT</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-base-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost rounded-xl text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-secondary rounded-xl text-sm shadow-md shadow-secondary/20">
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Create Teacher"
                  )
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-base-100 rounded-2xl border border-base-300 w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-error flex items-center gap-2">
              <FiTrash2 /> Confirm Delete
            </h3>
            <p className="text-sm text-base-content/70">
              Are you sure you want to delete teacher <strong className="text-base-content">{deleteCandidate.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setDeleteCandidate(null)} className="btn btn-ghost btn-sm rounded-xl">
                Cancel
              </button>
              <button onClick={handleDeleteTeacher} disabled={isSubmitting} className="btn btn-error btn-sm rounded-xl text-white">
                {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}