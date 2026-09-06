"use client";
import { useState, useEffect } from "react";
import { 
  FiClock, 
  FiPlus, 
  FiTrash2, 
  FiEdit, 
  FiX, 
  FiBookOpen, 
  FiUser, 
  FiMapPin,
  FiCalendar
} from "react-icons/fi";

export default function AdminRoutinePage() {
  const [routines, setRoutines] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedClass, setSelectedClass] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // Track if Editing or Adding
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const initialFormState = {
    day: "Sunday",
    classId: "Class 8",
    group: "General",
    subjectName: "Mathematics",
    teacherId: "",
    teacherName: "",
    startTime: "09:00",
    endTime: "10:00",
    roomNo: "101"
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/routine?day=${selectedDay}&classId=${selectedClass}`);
      const data = await res.json();
      if (data.success) setRoutines(data.routines);
    } catch (err) {
      console.error("Error fetching routines:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/teachers");
      const data = await res.json();
      if (data.success) setTeachers(data.teachers);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  useEffect(() => {
    fetchRoutines();
    fetchTeachers();
  }, [selectedDay, selectedClass]);

  const handleTeacherChange = (e) => {
    const selectedEmail = e.target.value;
    const teacherObj = teachers.find((t) => t.email === selectedEmail);
    setFormData({
      ...formData,
      teacherId: selectedEmail,
      teacherName: teacherObj ? teacherObj.name : ""
    });
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (item) => {
    setEditId(item._id);
    setFormData({
      day: item.day || "Sunday",
      classId: item.classId || "Class 8",
      group: item.group || "General",
      subjectName: item.subjectName || "",
      teacherId: item.teacherId || "",
      teacherName: item.teacherName || "",
      startTime: item.startTime || "09:00",
      endTime: item.endTime || "10:00",
      roomNo: item.roomNo || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = editId 
      ? `http://localhost:5000/api/admin/routine/${editId}` 
      : "http://localhost:5000/api/admin/routine";
      
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        fetchRoutines();
      } else {
        alert(data.message || "Failed to save routine.");
      }
    } catch (err) {
      alert("Server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:5000/api/admin/routine/${deleteCandidate._id}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (data.success) {
        setDeleteCandidate(null);
        fetchRoutines();
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch (err) {
      alert("Server error while deleting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2">
            <FiClock className="text-primary" /> Class Routine Management
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Assign periods, subject teachers, and schedules for classes.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="btn btn-primary rounded-xl flex items-center gap-2 shadow-md shadow-primary/20"
        >
          <FiPlus size={18} /> Add New Schedule
        </button>
      </div>

      {/* Filters */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-xs font-semibold text-base-content/60 block mb-1">Filter Day</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="select select-bordered select-sm rounded-xl"
          >
            <option value="All">All Days</option>
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-base-content/60 block mb-1">Filter Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="select select-bordered select-sm rounded-xl"
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

      {/* Routine Cards Grid */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs">
        {loading ? (
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : routines.length === 0 ? (
          <div className="text-center py-8 text-base-content/60 text-sm">
            No class schedules found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routines.map((item) => (
              <div
                key={item._id}
                className="border border-base-200 rounded-xl p-4 space-y-3 bg-base-200/30 hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badge & Day */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge badge-primary font-semibold text-xs truncate max-w-[150px]">
                      {item.classId} ({item.group || "General"})
                    </span>
                    <span className="text-xs font-bold text-base-content/70 flex items-center gap-1 shrink-0">
                      <FiCalendar size={12} /> {item.day}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div>
                    <h3 className="text-base font-bold text-base-content flex items-center gap-1.5 truncate">
                      <FiBookOpen size={16} className="text-primary shrink-0" /> {item.subjectName}
                    </h3>
                    <p className="text-xs text-base-content/70 mt-1 flex items-center gap-1 truncate">
                      <FiUser size={13} className="shrink-0" /> Teacher: <span className="font-semibold">{item.teacherName || "Unassigned"}</span>
                    </p>
                    <p className="text-xs text-base-content/60 mt-0.5 flex items-center gap-1 truncate">
                      <FiClock size={12} className="shrink-0" /> {item.startTime} - {item.endTime} | <FiMapPin size={12} className="shrink-0" /> Room: {item.roomNo}
                    </p>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-base-200/60 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="btn btn-ghost btn-xs text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 px-2"
                  >
                    <FiEdit size={14} />
                    <span className="text-[11px] font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(item)}
                    className="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-lg flex items-center gap-1 px-2"
                  >
                    <FiTrash2 size={14} />
                    <span className="text-[11px] font-medium">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-base-100 rounded-2xl border border-base-300 w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FiClock className="text-primary" /> {editId ? "Edit Routine Schedule" : "Add Routine Schedule"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Day</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="select select-bordered w-full select-sm rounded-xl"
                  >
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Class</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="select select-bordered w-full select-sm rounded-xl"
                  >
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Group</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="select select-bordered w-full select-sm rounded-xl"
                  >
                    <option value="General">General</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subjectName}
                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                    className="input input-bordered w-full input-sm rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Assign Teacher</label>
                <select
                  value={formData.teacherId}
                  onChange={handleTeacherChange}
                  className="select select-bordered w-full select-sm rounded-xl"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t.email}>
                      {t.name} ({t.subject || "Teacher"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="input input-bordered w-full input-sm rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="input input-bordered w-full input-sm rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Room No</label>
                  <input
                    type="text"
                    placeholder="302"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    className="input input-bordered w-full input-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-base-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-sm rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-sm rounded-xl">
                  {isSubmitting ? "Saving..." : editId ? "Update Schedule" : "Save Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-base-100 rounded-2xl p-5 w-full max-w-sm space-y-3">
            <h3 className="font-bold text-error">Confirm Delete</h3>
            <p className="text-xs text-base-content/70">
              Are you sure you want to remove {deleteCandidate.subjectName} class schedule for {deleteCandidate.day}?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDeleteCandidate(null)} className="btn btn-ghost btn-sm rounded-xl">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={isSubmitting} className="btn btn-error btn-sm text-white rounded-xl">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}