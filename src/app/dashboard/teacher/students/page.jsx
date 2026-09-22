"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client"; 
import { 
  FiUsers, 
  FiSearch, 
  FiEye, 
  FiMail, 
  FiPhone, 
  FiBookOpen, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight,
  FiFilter,
  FiUserCheck
} from "react-icons/fi";

export default function MyStudentsPage() {

  const { data: session } = useSession();
  
  const [students, setStudents] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");

  // Modal State for View Details
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchMyStudents = async () => {
      if (!session?.user?.email) return;
      
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/teacher/my-students?teacherEmail=${session.user.email}`);
        const data = await res.json();

        if (data.success) {
          setStudents(data.students || []);
          setAssignedClasses(data.assignedClasses || []);
        }
      } catch (err) {
        console.error("Error fetching my students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyStudents();
  }, [session?.user?.email]);

  // (Search and Class Filter)
  const filteredStudents = students.filter((std) => {
    // usersCollection-এ 'class' 
    const stdClass = std.class || std.classId || "";
    const matchesClass = selectedClass === "All" || stdClass === selectedClass;
    
    const name = std.name ? std.name.toLowerCase() : "";
    const roll = (std.roll || std.rollNo || std.studentId || "").toString().toLowerCase();
    const email = std.email ? std.email.toLowerCase() : "";

    const matchesSearch = 
      name.includes(searchTerm.toLowerCase()) || 
      roll.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    return matchesClass && matchesSearch;
  });

  
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 p-3 sm:p-5 pb-16">
      {/* Header */}
      <div className="bg-base-100 border border-base-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
            <FiUsers className="text-primary shrink-0" /> My Students
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Students from your assigned classes according to your schedule.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <FiUserCheck size={16} />
          Total Students: {students.length}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-base-100 border border-base-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
          <input
            type="text"
            placeholder="Search by name, roll, or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="input input-bordered input-sm pl-9 rounded-xl w-full text-xs font-medium focus:outline-none focus:border-primary"
          />
        </div>

        {/* Class Filter dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiFilter className="text-base-content/50 hidden sm:block" size={15} />
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setCurrentPage(1);
            }}
            className="select select-bordered select-sm rounded-xl text-xs font-semibold w-full sm:w-44 focus:outline-none focus:border-primary"
          >
            <option value="All">All My Classes ({assignedClasses.length})</option>
            {assignedClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table / List Container */}
      <div className="bg-base-100 border border-base-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-base-content/50 gap-2">
            <span className="loading loading-spinner text-primary loading-md"></span>
            <span className="text-xs font-medium">Loading your assigned students...</span>
          </div>
        ) : currentStudents.length === 0 ? (
          <div className="text-center py-12 px-4 text-base-content/60 text-sm">
            No students found in your assigned classes or matching your search.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-base-200 bg-base-200/50 text-xs text-base-content/70 uppercase">
                    <th className="py-3.5">Roll / ID</th>
                    <th className="py-3.5">Student Name</th>
                    <th className="py-3.5">Class</th>
                    <th className="py-3.5">Contact Info</th>
                    <th className="py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200/60 text-xs">
                  {currentStudents.map((std) => (
                    <tr key={std._id} className="hover:bg-base-200/30 transition-colors">
                      <td className="font-bold text-base-content/80">
                        #{std.roll || std.rollNo || std.studentId || "N/A"}
                      </td>
                      <td>
                        <div className="font-semibold text-sm text-base-content">{std.name}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <span className="badge badge-sm bg-primary/10 text-primary border-0 font-bold">
                            {std.class || std.classId || "N/A"}
                          </span>
                          {std.group && (
                            <span className="badge badge-sm border border-base-300 text-base-content/70 font-medium bg-transparent">
                              {std.group}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-0.5 text-base-content/70">
                          {std.email && (
                            <div className="flex items-center gap-1.5">
                              <FiMail size={12} className="text-base-content/40 shrink-0" />
                              <span>{std.email}</span>
                            </div>
                          )}
                          {std.phone && (
                            <div className="flex items-center gap-1.5">
                              <FiPhone size={12} className="text-base-content/40 shrink-0" />
                              <span>{std.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedStudent(std)}
                          className="btn btn-ghost btn-xs text-primary hover:bg-primary/10 rounded-lg gap-1 font-semibold"
                        >
                          <FiEye size={13} /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Cards */}
            <div className="block md:hidden divide-y divide-base-200">
              {currentStudents.map((std) => (
                <div key={std._id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-base-content">{std.name}</div>
                      <span className="text-xs font-semibold text-base-content/60">
                        Roll: #{std.roll || std.rollNo || std.studentId || "N/A"}
                      </span>
                    </div>
                    <span className="badge badge-sm bg-primary/10 text-primary border-0 font-bold">
                      {std.class || std.classId || "N/A"}
                    </span>
                  </div>

                  <div className="text-xs text-base-content/70 space-y-1 bg-base-200/40 p-2.5 rounded-xl">
                    {std.email && (
                      <div className="flex items-center gap-1.5">
                        <FiMail size={12} className="text-base-content/40 shrink-0" />
                        <span className="truncate">{std.email}</span>
                      </div>
                    )}
                    {std.phone && (
                      <div className="flex items-center gap-1.5">
                        <FiPhone size={12} className="text-base-content/40 shrink-0" />
                        <span>{std.phone}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedStudent(std)}
                    className="btn btn-primary btn-outline btn-xs w-full rounded-lg gap-1.5 font-semibold mt-1"
                  >
                    <FiEye size={13} /> View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-3 border-t border-base-200 bg-base-100 flex items-center justify-between text-xs">
                <span className="text-base-content/60">
                  Page {currentPage} of {totalPages} ({filteredStudents.length} items)
                </span>
                <div className="join">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item btn btn-xs btn-bordered"
                  >
                    <FiChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="join-item btn btn-xs btn-bordered"
                  >
                    <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Details Modal */}
      {selectedStudent && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md rounded-2xl p-5 border border-base-200">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="font-bold text-base flex items-center gap-1.5">
                <FiBookOpen className="text-primary" /> Student Details
              </h3>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="btn btn-sm btn-circle btn-ghost"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="bg-base-200/50 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-base-content">{selectedStudent.name}</div>
                  <div className="text-base-content/60">Roll: #{selectedStudent.roll || selectedStudent.rollNo || selectedStudent.studentId || "N/A"}</div>
                </div>
                <span className="badge badge-primary font-bold">
                  {selectedStudent.class || selectedStudent.classId || "N/A"}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1 border-b border-base-200">
                  <span className="text-base-content/60">Email:</span>
                  <span className="font-medium text-base-content">{selectedStudent.email || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-base-200">
                  <span className="text-base-content/60">Phone:</span>
                  <span className="font-medium text-base-content">{selectedStudent.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-base-200">
                  <span className="text-base-content/60">Group:</span>
                  <span className="font-medium text-base-content">{selectedStudent.group || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-base-200">
                  <span className="text-base-content/60">Guardian Phone:</span>
                  <span className="font-medium text-base-content">{selectedStudent.guardianPhone || selectedStudent.parentPhone || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="modal-action mt-2">
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="btn btn-sm btn-primary w-full rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}