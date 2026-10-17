 "use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FiSearch, 
  FiMail, 
  FiPhone, 
  FiBookOpen, 
  FiAward, 
  FiUser, 
  FiX, 
  FiFilter,
  FiBriefcase 
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedTeacher, setSelectedTeacher] = useState(null); // Modal-এর জন্য

  // Fetch Teachers Data
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
          const { data: tokenData } = await authClient.token();
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/teachers`, {
          headers: {
            authorization: `Bearer ${tokenData?.token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setTeachers(data.teachers || []);
        }
      } catch (err) {
        console.error("Failed to load teachers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filter Logic
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = 
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "All" || teacher.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  // Dynamic Subject Options for Filter
  const subjects = ["All", ...new Set(teachers.map((t) => t.subject).filter(Boolean))];

  return (
    <div className="min-h-screen bg-base-200/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* --- HEADER SECTION --- */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="badge badge-primary badge-outline text-xs font-semibold px-3 py-2">
            আমাদের শিক্ষক ও কর্মকর্তা
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-base-content tracking-tight">
            Our Respected <span className="text-primary">Teachers & Staff</span>
          </h1>
          <p className="text-sm text-base-content/70">
            Meet our dedicated team of educators committed to driving academic excellence and inspiring students every day.
          </p>
        </div>

        {/* --- SEARCH & FILTER BAR --- */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 text-lg" />
            <input
              type="text"
              placeholder="Search by name, subject, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl text-sm focus:outline-primary"
            />
          </div>

          {/* Subject Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <FiFilter className="text-primary text-lg shrink-0" />
            <span className="text-xs font-semibold text-base-content/70 whitespace-nowrap">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="select select-bordered select-sm w-full md:w-48 rounded-xl text-xs font-medium"
            >
              {subjects.map((sub, idx) => (
                <option key={idx} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- TEACHERS GRID --- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center text-base-content/60 space-y-2">
            <FiUser size={40} className="mx-auto text-base-content/30" />
            <p className="font-semibold text-base">No teachers found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher._id || teacher.id}
                className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs hover:border-primary/50 transition-all hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Teacher Avatar */}
                  <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors bg-base-200 flex items-center justify-center">
                    {teacher.image ? (
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-10 h-10 text-primary/60" />
                    )}
                  </div>

                  {/* Teacher Info */}
                  <div className="text-center space-y-1">
                    <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors line-clamp-1">
                      {teacher.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary/90 flex items-center justify-center gap-1">
                      <FiBriefcase size={12} /> {teacher.designation || "Assistant Teacher"}
                    </p>
                    <span className="badge badge-neutral badge-sm text-[11px] font-medium mt-1">
                      {teacher.subject || "General"}
                    </span>
                  </div>

                  {/* Quick Details */}
                  <div className="text-xs space-y-1.5 text-base-content/70 pt-3 border-t border-base-200">
                    {teacher.qualification && (
                      <div className="flex items-center gap-2 truncate">
                        <FiAward className="text-primary shrink-0" size={14} />
                        <span className="truncate">{teacher.qualification}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 truncate">
                      <FiMail className="text-primary shrink-0" size={14} />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="btn btn-primary btn-sm btn-outline rounded-xl w-full mt-5 font-semibold text-xs"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* --- TEACHER PROFILE MODAL --- */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-base-100 rounded-3xl border border-base-300 w-full max-w-md p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTeacher(null)}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/60"
            >
              <FiX size={18} />
            </button>

            {/* Modal Header Profile */}
            <div className="text-center space-y-3 pt-2">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary bg-base-200 flex items-center justify-center">
                {selectedTeacher.image ? (
                  <img src={selectedTeacher.image} alt={selectedTeacher.name} className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-10 h-10 text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-base-content">{selectedTeacher.name}</h3>
                <p className="text-xs font-semibold text-primary">{selectedTeacher.designation || "Assistant Teacher"}</p>
                <span className="badge badge-primary badge-outline text-xs mt-1">
                  Department: {selectedTeacher.subject || "General"}
                </span>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-3 bg-base-200/50 rounded-2xl p-4 text-xs sm:text-sm text-base-content/80">
              <div className="flex items-center gap-3">
                <FiAward className="text-primary text-base shrink-0" />
                <div>
                  <p className="text-[10px] text-base-content/50 uppercase font-bold">Qualification</p>
                  <p className="font-semibold">{selectedTeacher.qualification || "B.Sc / M.Sc in Education"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiMail className="text-primary text-base shrink-0" />
                <div>
                  <p className="text-[10px] text-base-content/50 uppercase font-bold">Email</p>
                  <p className="font-semibold">{selectedTeacher.email}</p>
                </div>
              </div>

              {selectedTeacher.phone && (
                <div className="flex items-center gap-3">
                  <FiPhone className="text-primary text-base shrink-0" />
                  <div>
                    <p className="text-[10px] text-base-content/50 uppercase font-bold">Phone</p>
                    <p className="font-semibold">{selectedTeacher.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action */}
            <button
              onClick={() => setSelectedTeacher(null)}
              className="btn btn-primary w-full rounded-xl font-semibold"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}