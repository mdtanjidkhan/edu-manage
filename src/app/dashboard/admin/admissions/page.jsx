// "use client"
// import React, { useState, useEffect, useCallback } from 'react';
// import { authClient } from "@/lib/auth-client";
// import { 
//   FiUsers, 
//   FiCheckCircle, 
//   FiXCircle, 
//   FiClock, 
//   FiSearch, 
//   FiFilter, 
//   FiEye, 
//   FiX, 
//   FiLoader,
//   FiAlertCircle,
//   FiBookOpen,
//   FiUser,
//   FiChevronLeft,
//   FiChevronRight,
//   FiRefreshCw,
//   FiCheck,
// //   FiBan
// } from 'react-icons/fi';

// const AdminAdmissionDashboard = () => {
//   const { data: session } = authClient.useSession();

//   // Stats State
//   const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
//   const [statsLoading, setStatsLoading] = useState(true);

//   // Applications & Pagination State
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState('');
  
//   // Filter & Search States
//   const [search, setSearch] = useState('');
//   const [status, setStatus] = useState('');
//   const [applyingClass, setApplyingClass] = useState('');
//   const [group, setGroup] = useState('');
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

//   // Modals
//   const [selectedApp, setSelectedApp] = useState(null); // Details View Modal
//   const [rejectModalApp, setRejectModalApp] = useState(null); // Reject Reason Modal
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [actionLoading, setActionLoading] = useState(false);

//   // 1. Fetch Stats Data (/api/admin/stats)
//   const fetchStats = async () => {
//     setStatsLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/stats`);
//       const data = await res.json();
//       if (res.ok && data.success) {
//         setStats(data.stats);
//       }
//     } catch (err) {
//       console.error('Failed to fetch stats:', err);
//     } finally {
//       setStatsLoading(false);
//     }
//   };

//   // 2. Fetch Applications with Search, Filter & Pagination (/api/admin/applications)
//   const fetchApplications = useCallback(async () => {
//     setLoading(true);
//     setErrorMsg('');
//     try {
//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//         ...(search && { search }),
//         ...(status && { status }),
//         ...(applyingClass && { applyingClass }),
//         ...(group && { group })
//       });

//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/applications?${queryParams}`);
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setApplications(data.data || []);
//         setPagination(data.pagination);
//       } else {
//         setErrorMsg(data.message || 'Failed to load applications.');
//       }
//     } catch (err) {
//       console.error('Fetch Error:', err);
//       setErrorMsg('Network error! Could not connect to backend server.');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, limit, search, status, applyingClass, group]);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   useEffect(() => {
//     fetchApplications();
//   }, [fetchApplications]);

//   // 3. Approve Application Handler (/api/admin/approve/:id)
//   const handleApprove = async (id) => {
//     if (!confirm('Are you sure you want to approve this application?')) return;
    
//     setActionLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/approve/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' }
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         fetchApplications();
//         fetchStats();
//       } else {
//         alert(data.message || 'Failed to approve application.');
//       }
//     } catch (err) {
//       console.error('Approve Error:', err);
//       alert('Error approving application.');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // 4. Reject Application Handler (/api/admin/reject/:id)
//   const handleRejectSubmit = async (e) => {
//     e.preventDefault();
//     if (!rejectModalApp || !rejectionReason.trim()) return;

//     setActionLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/reject/${rejectModalApp._id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ rejectionReason })
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setRejectModalApp(null);
//         setRejectionReason('');
//         fetchApplications();
//         fetchStats();
//       } else {
//         alert(data.message || 'Failed to reject application.');
//       }
//     } catch (err) {
//       console.error('Reject Error:', err);
//       alert('Error rejecting application.');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const getStatusBadge = (statusStr) => {
//     switch (statusStr) {
//       case 'Approved':
//         return 'bg-green-500/20 text-green-400 border-green-500/30';
//       case 'Rejected':
//         return 'bg-red-500/20 text-red-400 border-red-500/30';
//       default:
//         return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0b0f17] text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* Page Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
//               <FiBookOpen className="text-blue-500" /> Admission Applications Dashboard
//             </h1>
//             <p className="text-sm text-gray-400 mt-1">Review, approve, and manage incoming student applications.</p>
//           </div>
//           <button 
//             onClick={() => { fetchStats(); fetchApplications(); }}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-semibold text-gray-200 rounded-xl transition border border-gray-700 self-start sm:self-auto"
//           >
//             <FiRefreshCw className={loading || statsLoading ? 'animate-spin' : ''} /> Refresh
//           </button>
//         </div>

//         {/* 1. Statistics Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-400 font-medium">Total Applications</p>
//               <h3 className="text-2xl font-bold text-white mt-1">{stats.total}</h3>
//             </div>
//             <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl">
//               <FiUsers />
//             </div>
//           </div>

//           <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-400 font-medium">Pending Review</p>
//               <h3 className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</h3>
//             </div>
//             <div className="w-12 h-12 bg-yellow-500/10 text-yellow-400 rounded-xl flex items-center justify-center text-xl">
//               <FiClock />
//             </div>
//           </div>

//           <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-400 font-medium">Approved Students</p>
//               <h3 className="text-2xl font-bold text-green-400 mt-1">{stats.approved}</h3>
//             </div>
//             <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center text-xl">
//               <FiCheckCircle />
//             </div>
//           </div>

//           <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-400 font-medium">Rejected Applications</p>
//               <h3 className="text-2xl font-bold text-red-400 mt-1">{stats.rejected}</h3>
//             </div>
//             <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center text-xl">
//               <FiXCircle />
//             </div>
//           </div>
//         </div>

//         {/* 2. Search & Filter Bar */}
//         <div className="bg-[#111827] border border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
//           <div className="relative w-full md:w-80">
//             <FiSearch className="absolute left-3.5 top-3.5 text-gray-400 text-lg" />
//             <input 
//               type="text"
//               placeholder="Search Name, ID or Email..."
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//               className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:border-blue-500 outline-none"
//             />
//           </div>

//           <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
//             <div className="flex items-center gap-2 bg-[#1f2937] border border-gray-700 px-3 py-1.5 rounded-xl text-sm">
//               <FiFilter className="text-gray-400" />
//               <span className="text-xs text-gray-400">Status:</span>
//               <select 
//                 value={status}
//                 onChange={(e) => { setStatus(e.target.value); setPage(1); }}
//                 className="bg-transparent text-gray-200 text-sm outline-none cursor-pointer"
//               >
//                 <option value="" className="bg-[#1f2937]">All Status</option>
//                 <option value="Pending" className="bg-[#1f2937]">Pending</option>
//                 <option value="Approved" className="bg-[#1f2937]">Approved</option>
//                 <option value="Rejected" className="bg-[#1f2937]">Rejected</option>
//               </select>
//             </div>

//             <div className="flex items-center gap-2 bg-[#1f2937] border border-gray-700 px-3 py-1.5 rounded-xl text-sm">
//               <span className="text-xs text-gray-400">Class:</span>
//               <select 
//                 value={applyingClass}
//                 onChange={(e) => { setApplyingClass(e.target.value); setPage(1); }}
//                 className="bg-transparent text-gray-200 text-sm outline-none cursor-pointer"
//               >
//                 <option value="" className="bg-[#1f2937]">All Classes</option>
//                 <option value="Class 6" className="bg-[#1f2937]">Class 6</option>
//                 <option value="Class 7" className="bg-[#1f2937]">Class 7</option>
//                 <option value="Class 8" className="bg-[#1f2937]">Class 8</option>
//                 <option value="Class 9" className="bg-[#1f2937]">Class 9</option>
//                 <option value="Class 10" className="bg-[#1f2937]">Class 10</option>
//               </select>
//             </div>

//             {['Class 9', 'Class 10'].includes(applyingClass) && (
//               <div className="flex items-center gap-2 bg-[#1f2937] border border-gray-700 px-3 py-1.5 rounded-xl text-sm">
//                 <span className="text-xs text-gray-400">Group:</span>
//                 <select 
//                   value={group}
//                   onChange={(e) => { setGroup(e.target.value); setPage(1); }}
//                   className="bg-transparent text-gray-200 text-sm outline-none cursor-pointer"
//                 >
//                   <option value="" className="bg-[#1f2937]">All Groups</option>
//                   <option value="Science" className="bg-[#1f2937]">Science</option>
//                   <option value="Arts" className="bg-[#1f2937]">Arts</option>
//                   <option value="Commerce" className="bg-[#1f2937]">Commerce</option>
//                 </select>
//               </div>
//             )}
//           </div>
//         </div>

//         {errorMsg && (
//           <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
//             <FiAlertCircle /> {errorMsg}
//           </div>
//         )}

//         {/* 3. Applications Table */}
//         <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-16 space-y-3">
//               <FiLoader className="animate-spin text-3xl text-blue-500" />
//               <p className="text-sm text-gray-400">Loading applications...</p>
//             </div>
//           ) : applications.length === 0 ? (
//             <div className="text-center py-16 text-gray-400 text-sm space-y-2">
//               <p className="text-base font-semibold text-gray-300">No applications found</p>
//               <p className="text-xs text-gray-500">Try adjusting your search or filters.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm text-gray-300">
//                 <thead className="bg-[#172033] text-gray-400 font-semibold border-b border-gray-800 text-xs uppercase tracking-wider">
//                   <tr>
//                     <th className="py-3.5 px-4">App ID</th>
//                     <th className="py-3.5 px-4">Applicant Name</th>
//                     <th className="py-3.5 px-4">Applying Class</th>
//                     <th className="py-3.5 px-4">Contact Email</th>
//                     <th className="py-3.5 px-4">Status</th>
//                     <th className="py-3.5 px-4 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-800/60">
//                   {applications.map((app) => (
//                     <tr key={app._id} className="hover:bg-gray-800/40 transition">
//                       <td className="py-3.5 px-4 font-mono font-bold text-blue-400 text-xs">
//                         {app.applicationId}
//                       </td>
//                       <td className="py-3.5 px-4">
//                         <div className="font-semibold text-white">{app.applicantName}</div>
//                         <div className="text-xs text-gray-500">Result: {app.previousResult || 'N/A'}</div>
//                       </td>
//                       <td className="py-3.5 px-4">
//                         <span className="font-medium text-gray-200">{app.applyingClass}</span>
//                         {app.group && app.group !== 'General' && (
//                           <span className="block text-xs text-gray-400">({app.group})</span>
//                         )}
//                       </td>
//                       <td className="py-3.5 px-4 text-xs text-gray-300">
//                         {app.email}
//                       </td>
//                       <td className="py-3.5 px-4">
//                         <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
//                           {app.status}
//                         </span>
//                       </td>
//                       <td className="py-3.5 px-4 text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           {/* View Details */}
//                           <button
//                             onClick={() => setSelectedApp(app)}
//                             title="View Details"
//                             className="p-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition"
//                           >
//                             <FiEye />
//                           </button>

//                           {/* Approve Action */}
//                           {app.status !== 'Approved' && (
//                             <button
//                               onClick={() => handleApprove(app._id)}
//                               disabled={actionLoading}
//                               title="Approve Application"
//                               className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition border border-green-500/30"
//                             >
//                               <FiCheck />
//                             </button>
//                           )}

//                           {/* Reject Action */}
//                           {app.status !== 'Rejected' && (
//                             <button
//                               onClick={() => {
//                                 setRejectModalApp(app);
//                                 setRejectionReason(app.rejectionReason || '');
//                               }}
//                               disabled={actionLoading}
//                               title="Reject Application"
//                               className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition border border-red-500/30"
//                             >
//                             <FiXCircle></FiXCircle>
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination Controls */}
//           {pagination.totalPages > 1 && (
//             <div className="flex items-center justify-between px-6 py-4 bg-[#172033] border-t border-gray-800 text-xs text-gray-400">
//               <div>
//                 Showing Page <span className="text-white font-bold">{pagination.page}</span> of <span className="text-white font-bold">{pagination.totalPages}</span> (Total {pagination.total} items)
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={page === 1}
//                   className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-200 rounded-lg transition"
//                 >
//                   <FiChevronLeft />
//                 </button>
//                 <button
//                   onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
//                   disabled={page === pagination.totalPages}
//                   className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-200 rounded-lg transition"
//                 >
//                   <FiChevronRight />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//       </div>

//       {/* ================= 1. VIEW DETAILS MODAL ================= */}
//       {selectedApp && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
//           <div className="relative w-full max-w-2xl bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#172033]">
//               <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                 <FiUser className="text-blue-500" /> Applicant Full Information
//               </h3>
//               <button 
//                 onClick={() => setSelectedApp(null)}
//                 className="text-gray-400 hover:text-white p-1 rounded-lg transition"
//               >
//                 <FiX className="text-xl" />
//               </button>
//             </div>

//             <div className="p-6 space-y-6 text-sm">
//               <div className="flex items-center justify-between bg-[#1f2937] p-4 rounded-xl border border-gray-700">
//                 <div>
//                   <p className="text-xs text-gray-400">Application ID</p>
//                   <p className="text-lg font-mono font-bold text-blue-400">{selectedApp.applicationId}</p>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedApp.status)}`}>
//                   {selectedApp.status}
//                 </span>
//               </div>

//               <div className="space-y-2">
//                 <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-gray-800 pb-1">1. Personal Info</h4>
//                 <div className="grid grid-cols-2 gap-3 text-gray-300 pt-1">
//                   <div><strong className="text-gray-500">Name:</strong> {selectedApp.applicantName}</div>
//                   <div><strong className="text-gray-500">DOB:</strong> {selectedApp.dateOfBirth}</div>
//                   <div><strong className="text-gray-500">Gender:</strong> {selectedApp.gender}</div>
//                   <div><strong className="text-gray-500">Email:</strong> {selectedApp.email}</div>
//                   <div><strong className="text-gray-500">Phone:</strong> {selectedApp.phone}</div>
//                   <div><strong className="text-gray-500">Previous School:</strong> {selectedApp.previousSchool}</div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-gray-800 pb-1">2. Academic Info</h4>
//                 <div className="grid grid-cols-2 gap-3 text-gray-300 pt-1">
//                   <div><strong className="text-gray-500">Applying Class:</strong> {selectedApp.applyingClass}</div>
//                   <div><strong className="text-gray-500">Group:</strong> {selectedApp.group}</div>
//                   <div><strong className="text-gray-500">Previous Class:</strong> {selectedApp.previousClass}</div>
//                   <div><strong className="text-gray-500">Previous GPA/Result:</strong> {selectedApp.previousResult}</div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-gray-800 pb-1">3. Guardian Info</h4>
//                 <div className="grid grid-cols-2 gap-3 text-gray-300 pt-1">
//                   <div><strong className="text-gray-500">Father's Name:</strong> {selectedApp.fatherName}</div>
//                   <div><strong className="text-gray-500">Mother's Name:</strong> {selectedApp.motherName}</div>
//                   <div><strong className="text-gray-500">Guardian Phone:</strong> {selectedApp.guardianPhone}</div>
//                   <div><strong className="text-gray-500">Guardian Email:</strong> {selectedApp.guardianEmail || 'N/A'}</div>
//                   <div className="col-span-2"><strong className="text-gray-500">Address:</strong> {selectedApp.address}</div>
//                 </div>
//               </div>

//               {selectedApp.rejectionReason && (
//                 <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
//                   <strong>Rejection Reason:</strong> {selectedApp.rejectionReason}
//                 </div>
//               )}
//             </div>

//             <div className="px-6 py-4 border-t border-gray-800 bg-[#172033] text-right">
//               <button 
//                 onClick={() => setSelectedApp(null)}
//                 className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-semibold transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= 2. REJECT REASON MODAL ================= */}
//       {rejectModalApp && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
//           <div className="relative w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#172033]">
//               <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                 <FiXCircle className="text-red-500" /> Reject Application
//               </h3>
//               <button 
//                 onClick={() => setRejectModalApp(null)}
//                 className="text-gray-400 hover:text-white p-1 rounded-lg transition"
//               >
//                 <FiX className="text-xl" />
//               </button>
//             </div>

//             <form onSubmit={handleRejectSubmit} className="p-6 space-y-4">
//               <div>
//                 <p className="text-xs text-gray-400">Applicant Name</p>
//                 <p className="text-base font-semibold text-white">{rejectModalApp.applicantName}</p>
//                 <p className="text-xs font-mono text-blue-400 mt-0.5">{rejectModalApp.applicationId}</p>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-gray-300 mb-1">
//                   Rejection Reason <span className="text-red-400">*</span>
//                 </label>
//                 <textarea 
//                   rows="3"
//                   required
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                   placeholder="Provide reason for rejection (e.g. Invalid GPA documents, Seat capacity full)..."
//                   className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 text-sm text-white outline-none focus:border-red-500 resize-none"
//                 ></textarea>
//               </div>

//               <div className="flex items-center justify-end gap-3 pt-2">
//                 <button 
//                   type="button"
//                   onClick={() => setRejectModalApp(null)}
//                   className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold transition"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit"
//                   disabled={actionLoading}
//                   className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/30 flex items-center gap-1.5"
//                 >
//                   {actionLoading ? <FiLoader className="animate-spin" /> : 'Confirm Rejection'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminAdmissionDashboard;


"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { authClient } from "@/lib/auth-client";
import { 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiX, 
  FiLoader,
  FiAlertCircle,
  FiBookOpen,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminAdmissionDashboard = () => {
  const { data: session } = authClient.useSession();

  // Stats State
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Applications & Pagination State
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Filter & Search States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [applyingClass, setApplyingClass] = useState('');
  const [group, setGroup] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectModalApp, setRejectModalApp] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce Search Handler (৫০টি রিকুয়েস্টের বদলে টাইপিং শেষে ১টি যাবে)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 1. Fetch Stats Data (/api/admin/stats)
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/stats/count`);
      const data = await res.json();
      if (res.ok && data.success && data.stats) {
        setStats({
          total: data.stats.total ?? 0,
          pending: data.stats.pending ?? 0,
          approved: data.stats.approved ?? 0,
          rejected: data.stats.rejected ?? 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // 2. Fetch Applications with Search, Filter & Pagination (/api/admin/applications)
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(status && { status }),
        ...(applyingClass && { applyingClass }),
        ...(group && { group })
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/applications?${queryParams}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setApplications(data.data || []);
        setPagination(data.pagination || { totalPages: 1, total: 0 });
      } else {
        setErrorMsg(data.message || 'Failed to load applications.');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setErrorMsg('Network error! Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, status, applyingClass, group]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // 3. Approve Application Handler (/api/admin/approve/:id)
  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/approve/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        fetchApplications();
        fetchStats();
      } else {
        toast(data.message || 'Failed to approve application.');
      }
    } catch (err) {
      console.error('Approve Error:', err);
      alert('Error approving application.');
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Reject Application Handler (/api/admin/reject/:id)
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModalApp || !rejectionReason.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/reject/${rejectModalApp._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRejectModalApp(null);
        setRejectionReason('');
        fetchApplications();
        fetchStats();
      } else {
        alert(data.message || 'Failed to reject application.');
      }
    } catch (err) {
      console.error('Reject Error:', err);
      alert('Error rejecting application.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (statusStr) => {
    switch (statusStr) {
      case 'Approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <FiBookOpen className="text-blue-500" /> Admission Applications Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">Review, approve, and manage incoming student applications.</p>
          </div>
          <button 
            onClick={() => { fetchStats(); fetchApplications(); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-semibold text-gray-200 rounded-xl transition border border-gray-700 self-start sm:self-auto"
          >
            <FiRefreshCw className={loading || statsLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* 1. Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Applications</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {statsLoading ? "..." : (stats?.total ?? 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl">
              <FiUsers />
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Pending Review</p>
              <h3 className="text-2xl font-bold text-yellow-400 mt-1">
                {statsLoading ? "..." : (stats?.pending ?? 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 text-yellow-400 rounded-xl flex items-center justify-center text-xl">
              <FiClock />
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Approved Students</p>
              <h3 className="text-2xl font-bold text-green-400 mt-1">
                {statsLoading ? "..." : (stats?.approved ?? 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center text-xl">
              <FiCheckCircle />
            </div>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Rejected Applications</p>
              <h3 className="text-2xl font-bold text-red-400 mt-1">
                {statsLoading ? "..." : (stats?.rejected ?? 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center text-xl">
              <FiXCircle />
            </div>
          </div>
        </div>

        {/* 2. Search & Filter Bar */}
        <div className="bg-[#111827] border border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-400 text-lg" />
            <input 
              type="text"
              placeholder="Search Name, ID or Email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-[#1f2937] border border-gray-700 px-3 py-1.5 rounded-xl text-sm">
              <FiFilter className="text-gray-400" />
              <span className="text-xs text-gray-400">Status:</span>
              <select 
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="bg-transparent text-gray-200 text-sm outline-none cursor-pointer"
              >
                <option value="" className="bg-[#1f2937]">All Status</option>
                <option value="Pending" className="bg-[#1f2937]">Pending</option>
                <option value="Approved" className="bg-[#1f2937]">Approved</option>
                <option value="Rejected" className="bg-[#1f2937]">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#1f2937] border border-gray-700 px-3 py-1.5 rounded-xl text-sm">
              <span className="text-xs text-gray-400">Class:</span>
              <select 
                value={applyingClass}
                onChange={(e) => { setApplyingClass(e.target.value); setPage(1); }}
                className="bg-transparent text-gray-200 text-sm outline-none cursor-pointer"
              >
                <option value="" className="bg-[#1f2937]">All Classes</option>
                <option value="Class 6" className="bg-[#1f2937]">Class 6</option>
                <option value="Class 7" className="bg-[#1f2937]">Class 7</option>
                <option value="Class 8" className="bg-[#1f2937]">Class 8</option>
                <option value="Class 9" className="bg-[#1f2937]">Class 9</option>
                <option value="Class 10" className="bg-[#1f2937]">Class 10</option>
              </select>
            </div>

            {['Class 9', 'Class 10'].includes(applyingClass) && (
              <div className="flex items-center gap-2 bg-[#1f2937] border border-gray-700 px-3 py-1.5 rounded-xl text-sm">
                <span className="text-xs text-gray-400">Group:</span>
                <select 
                  value={group}
                  onChange={(e) => { setGroup(e.target.value); setPage(1); }}
                  className="bg-transparent text-gray-200 text-sm outline-none cursor-pointer"
                >
                  <option value="" className="bg-[#1f2937]">All Groups</option>
                  <option value="Science" className="bg-[#1f2937]">Science</option>
                  <option value="Arts" className="bg-[#1f2937]">Arts</option>
                  <option value="Commerce" className="bg-[#1f2937]">Commerce</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <FiAlertCircle /> {errorMsg}
          </div>
        )}

        {/* 3. Applications Table */}
        <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <FiLoader className="animate-spin text-3xl text-blue-500" />
              <p className="text-sm text-gray-400">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm space-y-2">
              <p className="text-base font-semibold text-gray-300">No applications found</p>
              <p className="text-xs text-gray-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#172033] text-gray-400 font-semibold border-b border-gray-800 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">App ID</th>
                    <th className="py-3.5 px-4">Applicant Name</th>
                    <th className="py-3.5 px-4">Applying Class</th>
                    <th className="py-3.5 px-4">Contact Email</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400 text-xs">
                        {app.applicationId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{app.applicantName}</div>
                        <div className="text-xs text-gray-500">Result: {app.previousResult || 'N/A'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-gray-200">{app.applyingClass}</span>
                        {app.group && app.group !== 'General' && (
                          <span className="block text-xs text-gray-400">({app.group})</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-300">
                        {app.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedApp(app)}
                            title="View Details"
                            className="p-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition"
                          >
                            <FiEye />
                          </button>

                          {/* Approve Action */}
                          {app.status !== 'Approved' && (
                            <button
                              onClick={() => handleApprove(app._id)}
                              disabled={actionLoading}
                              title="Approve Application"
                              className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition border border-green-500/30"
                            >
                              <FiCheck />
                            </button>
                          )}

                          {/* Reject Action */}
                          {app.status !== 'Rejected' && (
                            <button
                              onClick={() => {
                                setRejectModalApp(app);
                                setRejectionReason(app.rejectionReason || '');
                              }}
                              disabled={actionLoading}
                              title="Reject Application"
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition border border-red-500/30"
                            >
                              <FiXCircle />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-[#172033] border-t border-gray-800 text-xs text-gray-400">
              <div>
                Showing Page <span className="text-white font-bold">{pagination.page}</span> of <span className="text-white font-bold">{pagination.totalPages}</span> (Total {pagination.total} items)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-200 rounded-lg transition"
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                  disabled={page === pagination.totalPages}
                  className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-200 rounded-lg transition"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* View Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#172033]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiUser className="text-blue-500" /> Applicant Full Information
              </h3>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-sm">
              <div className="flex items-center justify-between bg-[#1f2937] p-4 rounded-xl border border-gray-700">
                <div>
                  <p className="text-xs text-gray-400">Application ID</p>
                  <p className="text-lg font-mono font-bold text-blue-400">{selectedApp.applicationId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedApp.status)}`}>
                  {selectedApp.status}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-gray-800 pb-1">1. Personal Info</h4>
                <div className="grid grid-cols-2 gap-3 text-gray-300 pt-1">
                  <div><strong className="text-gray-500">Name:</strong> {selectedApp.applicantName}</div>
                  <div><strong className="text-gray-500">DOB:</strong> {selectedApp.dateOfBirth}</div>
                  <div><strong className="text-gray-500">Gender:</strong> {selectedApp.gender}</div>
                  <div><strong className="text-gray-500">Email:</strong> {selectedApp.email}</div>
                  <div><strong className="text-gray-500">Phone:</strong> {selectedApp.phone}</div>
                  <div><strong className="text-gray-500">Previous School:</strong> {selectedApp.previousSchool}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-gray-800 pb-1">2. Academic Info</h4>
                <div className="grid grid-cols-2 gap-3 text-gray-300 pt-1">
                  <div><strong className="text-gray-500">Applying Class:</strong> {selectedApp.applyingClass}</div>
                  <div><strong className="text-gray-500">Group:</strong> {selectedApp.group}</div>
                  <div><strong className="text-gray-500">Previous Class:</strong> {selectedApp.previousClass}</div>
                  <div><strong className="text-gray-500">Previous GPA/Result:</strong> {selectedApp.previousResult}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-gray-800 pb-1">3. Guardian Info</h4>
                <div className="grid grid-cols-2 gap-3 text-gray-300 pt-1">
                  <div><strong className="text-gray-500">Father's Name:</strong> {selectedApp.fatherName}</div>
                  <div><strong className="text-gray-500">Mother's Name:</strong> {selectedApp.motherName}</div>
                  <div><strong className="text-gray-500">Guardian Phone:</strong> {selectedApp.guardianPhone}</div>
                  <div><strong className="text-gray-500">Guardian Email:</strong> {selectedApp.guardianEmail || 'N/A'}</div>
                  <div className="col-span-2"><strong className="text-gray-500">Address:</strong> {selectedApp.address}</div>
                </div>
              </div>

              {selectedApp.rejectionReason && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
                  <strong>Rejection Reason:</strong> {selectedApp.rejectionReason}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-800 bg-[#172033] text-right">
              <button 
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#172033]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiXCircle className="text-red-500" /> Reject Application
              </h3>
              <button 
                onClick={() => setRejectModalApp(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-400">Applicant Name</p>
                <p className="text-base font-semibold text-white">{rejectModalApp.applicantName}</p>
                <p className="text-xs font-mono text-blue-400 mt-0.5">{rejectModalApp.applicationId}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Rejection Reason <span className="text-red-400">*</span>
                </label>
                <textarea 
                  rows="3"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide reason for rejection (e.g. Invalid GPA documents, Seat capacity full)..."
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 text-sm text-white outline-none focus:border-red-500 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setRejectModalApp(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/30 flex items-center gap-1.5"
                >
                  {actionLoading ? <FiLoader className="animate-spin" /> : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminAdmissionDashboard;