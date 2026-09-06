
"use client";
import { useEffect, useState } from "react";
import { 
  FiUsers, 
  FiPlus, 
  FiSearch, 
  FiUser, 
  FiMail, 
  FiLock, 
  FiBookOpen, 
  FiHash,
  FiX,
  FiEdit2,
  FiTrash2,
  FiLayers
} from "react-icons/fi";

export default function ManageStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    class: "Class 6",
    group: "General"
  });

  // ১. Express API থেকে স্টুডেন্ট লিস্ট লোড করা
  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Class 6-8 এর জন্য group স্বয়ংক্রিয়ভাবে General হবে
    if (name === "class" && ["Class 6", "Class 7", "Class 8"].includes(value)) {
      setFormData({ ...formData, class: value, group: "General" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add modal ওপেন করার জন্য
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditingStudentId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      studentId: "",
      class: "Class 6",
      group: "General"
    });
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  // Edit modal ওপেন করার জন্য
  const handleOpenEditModal = (student) => {
    setIsEditMode(true);
    setEditingStudentId(student._id);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      password: "",
      studentId: student.studentId || "",
      class: student.class || "Class 6",
      group: student.group || "General"
    });
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  // ২. স্টুডেন্ট ক্রিয়েট অথবা আপডেট হ্যান্ডলার (POST / PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");

    const url = isEditMode 
      ? `http://localhost:5000/api/admin/students/${editingStudentId}`
      : "http://localhost:5000/api/admin/students";

    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setFormSuccess(isEditMode ? "Student updated successfully!" : "Student added successfully!");
        fetchStudents();
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

  // ৩. স্টুডেন্ট ডিলিট হ্যান্ডলার (DELETE)
  const handleDeleteStudent = async () => {
    if (!deleteCandidate) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:5000/api/admin/students/${deleteCandidate._id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (data.success) {
        setDeleteCandidate(null);
        fetchStudents();
      } else {
        alert(data.message || "Failed to delete student.");
      }
    } catch (err) {
      alert("Server error while deleting student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ৪. ফিল্টারিং লজিক (Search & Class Filter)
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedClass === "All" || student.class === selectedClass;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Top Title & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2">
            <FiUsers className="text-primary" /> Manage Students
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            View, add, edit, and manage enrolled students across classes (Class 6 - 10).
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn btn-primary rounded-xl flex items-center gap-2 shadow-md shadow-primary/20"
        >
          <FiPlus size={18} /> Add New Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-base-content/60 uppercase whitespace-nowrap">
            Class Filter:
          </span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="select select-bordered w-full md:w-56 rounded-xl text-sm focus:outline-none focus:border-primary"
          >
            <option value="All">All Classes</option>
            <option value="Class 6">Class 6</option>
            <option value="Class 7">Class 7</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <span className="loading loading-spinner loading-md text-primary"></span>
            <p className="text-sm text-base-content/60">Fetching student records...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center p-12 text-base-content/60">
            No students found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70 text-xs font-semibold uppercase">
                <tr>
                  <th>Student Info</th>
                  <th>Student ID</th>
                  <th>Class</th>
                  <th>Group</th>
                  <th>Joined Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-sm">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-base-200/30 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/10 text-primary font-bold rounded-full w-10 h-10 flex items-center justify-center">
                            {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-base-content">{student.name}</div>
                          <div className="text-xs text-base-content/60">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-semibold">
                        {student.studentId || <span className="badge badge-warning badge-sm">Pending</span>}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm font-medium">
                        {student.class || <span className="text-error font-semibold">Not Set</span>}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-outline badge-sm font-medium">
                        {student.group || "General"}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenEditModal(student)}
                          className="btn btn-ghost btn-xs text-primary font-semibold"
                          title="Edit Student"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button 
                          onClick={() => setDeleteCandidate(student)}
                          className="btn btn-ghost btn-xs text-error font-semibold"
                          title="Delete Student"
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

      {/* --- ADD / EDIT STUDENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-base-100 rounded-2xl border border-base-300 w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-base-200">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <FiUser className="text-primary" /> {isEditMode ? "Edit Student Details" : "Add New Student"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="btn btn-sm btn-circle btn-ghost"
              >
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
                    placeholder="e.g. Md Tanjid Hasan"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-primary"
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
                    placeholder="student@edumanage.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-primary"
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
                      className="input input-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">Student ID / Roll</label>
                <div className="relative">
                  <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    name="studentId"
                    required
                    placeholder="e.g. ST-202601"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="input input-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Class and Group Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-base-content/70 mb-1 block">Class</label>
                  <div className="relative">
                    <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      className="select select-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-base-content/70 mb-1 block">Group / Section</label>
                  <div className="relative">
                    <FiLayers className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <select
                      name="group"
                      value={formData.group}
                      onChange={handleInputChange}
                      disabled={["Class 6", "Class 7", "Class 8"].includes(formData.class)}
                      className="select select-bordered w-full pl-9 rounded-xl text-sm focus:outline-none focus:border-primary disabled:bg-base-200"
                    >
                      {["Class 6", "Class 7", "Class 8"].includes(formData.class) ? (
                        <option value="General">General</option>
                      ) : (
                        <>
                          <option value="Science">Science</option>
                          <option value="Arts">Arts</option>
                          <option value="Commerce">Commerce</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary rounded-xl text-sm shadow-md shadow-primary/20"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Create Student"
                  ) }
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
              Are you sure you want to delete student <strong className="text-base-content">{deleteCandidate.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="btn btn-ghost btn-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                disabled={isSubmitting}
                className="btn btn-error btn-sm rounded-xl text-white"
              >
                {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}