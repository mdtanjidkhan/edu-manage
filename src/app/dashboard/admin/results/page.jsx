"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  FiFileText, 
  FiSearch, 
  FiLayers, 
  FiAward, 
  FiBook, 
  FiCheckCircle, 
  FiLock, 
  FiUnlock, 
  FiUser, 
  FiHash,
  FiShield
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminResultsPage() {
  // ফিল্টার ও সার্চ স্টেট
  const [selectedClass, setSelectedClass] = useState("Class 8");
  const [selectedExam, setSelectedExam] = useState("Midterm");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ডাটা ফেচ করা
  const fetchAdminResults = async () => {
    setLoading(true);
    try {
      const { data: tokenData } = await authClient.token();
      
      let url = `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/results?classId=${selectedClass}&examType=${selectedExam}&subjectName=${selectedSubject}`;
      
      if (selectedGroup !== "All") url += `&group=${selectedGroup}`;
      if (selectedStatus !== "All") url += `&status=${selectedStatus}`;
      if (searchQuery.trim() !== "") url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url, {
        headers: {
          authorization: `Bearer ${tokenData?.token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        setResults(data.results || []);
      } else {
        toast.error(data.message || "Failed to fetch results.");
      }
    } catch (err) {
      console.error("Error fetching admin results:", err);
      toast.error("Server error while fetching results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminResults();
  }, [selectedClass, selectedExam, selectedSubject, selectedGroup, selectedStatus]);

  // সার্চ হ্যান্ডলার (Debounce বা সরাসরি সার্চ)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminResults();
  };

  // পাবলিশ / আনপাবলিশ / পারমিশন অ্যাকশন হ্যান্ডলার
  const handleUpdateStatus = async (newStatus, editPermittedVal) => {
    if (!results.length) {
      toast.error("No marks records found to update!");
      return;
    }

    setActionLoading(true);
    try {
      const { data: tokenData } = await authClient.token();
      const payload = {
        classId: selectedClass,
        examType: selectedExam,
        subjectName: selectedSubject,
        ...(newStatus && { status: newStatus }),
        ...(typeof editPermittedVal === "boolean" && { editPermitted: editPermittedVal })
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/results/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Status updated successfully!");
        fetchAdminResults(); // ডাটা রিফ্রেশ করা
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      toast.error("Server error during status update.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-2 sm:p-4 pb-12">
      {/* Header */}
      <div className="bg-base-100 border border-base-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
              <FiShield className="text-primary shrink-0" /> Admin Marks & Result Management
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Review teacher marks, publish results for students, and manage edit permissions seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className="bg-base-100 border border-base-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-base-content/70 uppercase tracking-wider flex items-center gap-1.5">
          <FiLayers className="text-primary" /> Filter Options & Search
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Class Select */}
          <div className="form-control w-full">
            <label className="label py-1"><span className="label-text text-xs font-semibold text-base-content/70">Class</span></label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
            >
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>

          {/* Group Select */}
          <div className="form-control w-full">
            <label className="label py-1"><span className="label-text text-xs font-semibold text-base-content/70">Group</span></label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
            >
              <option value="All">All Groups</option>
              <option value="General">General</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>

          {/* Exam Select */}
          <div className="form-control w-full">
            <label className="label py-1"><span className="label-text text-xs font-semibold text-base-content/70">Exam Type</span></label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
            >
              <option value="First Term">First Term</option>
              <option value="Midterm">Midterm</option>
              <option value="Final Exam">Final Exam</option>
            </select>
          </div>

          {/* Subject Select */}
          <div className="form-control w-full">
            <label className="label py-1"><span className="label-text text-xs font-semibold text-base-content/70">Subject</span></label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Bangla">Bangla</option>
              <option value="Science">Science</option>
            </select>
          </div>

          {/* Status Select */}
          <div className="form-control w-full">
            <label className="label py-1"><span className="label-text text-xs font-semibold text-base-content/70">Status</span></label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl text-sm font-medium focus:outline-none focus:border-primary"
            >
              <option value="All">All Status</option>
              <option value="Unpublished">Unpublished</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>

        {/* Search Bar & Master Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-base-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by student name or roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered input-sm rounded-xl w-full pl-8 text-xs focus:outline-none focus:border-primary"
              />
              <FiSearch className="absolute left-2.5 top-2.5 text-base-content/40" size={14} />
            </div>
            <button type="submit" className="btn btn-sm btn-outline rounded-xl text-xs">Search</button>
          </form>

          {/* Quick Publish / Unpublish / Edit Permission Master Controls */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => handleUpdateStatus("Published", false)}
              disabled={actionLoading}
              className="btn btn-success btn-sm text-white rounded-xl text-xs flex items-center gap-1 shadow-xs"
            >
              <FiCheckCircle size={14} /> Publish All
            </button>
            <button
              onClick={() => handleUpdateStatus("Unpublished", false)}
              disabled={actionLoading}
              className="btn btn-warning btn-sm text-white rounded-xl text-xs flex items-center gap-1 shadow-xs"
            >
              <FiLock size={14} /> Unpublish
            </button>
            <button
              onClick={() => handleUpdateStatus(null, true)}
              disabled={actionLoading}
              className="btn btn-info btn-sm text-white rounded-xl text-xs flex items-center gap-1 shadow-xs"
            >
              <FiUnlock size={14} /> Allow Edit (Teacher)
            </button>
          </div>
        </div>
      </div>

      {/* Main Results Table Area */}
      <div className="bg-base-100 border border-base-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-base-200 bg-base-200/30 flex items-center justify-between">
          <h3 className="text-sm font-bold text-base-content">
            Results Record <span className="text-primary">({results.length} Students)</span>
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-base-content/50 gap-2">
            <span className="loading loading-spinner text-primary loading-md"></span>
            <span className="text-xs font-medium">Loading marks records...</span>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 px-4 text-base-content/60 text-sm">
            No marks records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-200 bg-base-200/50 text-xs text-base-content/70 uppercase">
                  <th className="py-3.5">Roll</th>
                  <th className="py-3.5">Student Info</th>
                  <th className="py-3.5">Teacher</th>
                  <th className="py-3.5 text-center">Marks</th>
                  <th className="py-3.5 text-center">Status</th>
                  <th className="py-3.5 text-center">Edit Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200/60">
                {results.map((item) => (
                  <tr key={item._id} className="hover:bg-base-200/30 transition-colors">
                    <td className="font-bold text-xs text-base-content/70">
                      #{item.roll}
                    </td>
                    <td>
                      <div className="font-semibold text-sm text-base-content">{item.studentName}</div>
                      <div className="text-[11px] text-base-content/60">{item.group || "General"}</div>
                    </td>
                    <td>
                      <div className="text-xs font-medium text-base-content/80">{item.teacherName || "N/A"}</div>
                      <div className="text-[10px] text-base-content/50">{item.teacherEmail}</div>
                    </td>
                    <td className="text-center font-bold text-primary text-sm">
                      {item.obtainedMarks}
                    </td>
                    <td className="text-center">
                      {item.status === "Published" ? (
                        <span className="badge badge-success text-white badge-sm font-medium">Published</span>
                      ) : (
                        <span className="badge badge-warning text-white badge-sm font-medium">Unpublished</span>
                      )}
                    </td>
                    <td className="text-center">
                      {item.editPermitted ? (
                        <span className="badge badge-info text-white badge-sm font-medium">Permitted</span>
                      ) : (
                        <span className="badge badge-ghost badge-sm font-medium">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}