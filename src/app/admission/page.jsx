// "use client"
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; 
// import { authClient } from "@/lib/auth-client"; 
// import { 
//   FiBookOpen, 
//   FiCheckCircle, 
//   FiUsers, 
//   FiAward, 
//   FiClock, 
//   FiX, 
//   FiSend, 
//   FiUser, 
//   FiCalendar, 
//   FiMail, 
//   FiPhone, 
//   FiImage, 
//   FiHome, 
//   FiLayers,
//   FiAlertCircle,
//   FiLoader,
//   FiLogIn
// } from 'react-icons/fi';

// const AdmissionPage = () => {
//   const router = useRouter();

//   const { data: session, isPending: isSessionLoading } = authClient.useSession();
//   const user = session?.user;

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [fetchingStatus, setFetchingStatus] = useState(false);
  
//   const [myApplication, setMyApplication] = useState(null);
//   const [successData, setSuccessData] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');

//   const [formData, setFormData] = useState({
//     applicantName: '',
//     dateOfBirth: '',
//     gender: 'Male',
//     email: '',
//     phone: '',
//     profilePhoto: '',
//     previousSchool: '',
//     applyingClass: 'Class 6',
//     group: 'General',
//     previousClass: '',
//     previousResult: '',
//     fatherName: '',
//     motherName: '',
//     guardianPhone: '',
//     guardianEmail: '',
//     address: ''
//   });

//   // ২. ইউজার লোড হলে ফর্মের প্রাথমিক মান অটো-ফিল করা
//   useEffect(() => {
//     if (user) {
//       setFormData((prev) => ({
//         ...prev,
//         applicantName: user.name || '',
//         email: user.email || '',
//         profilePhoto: user.image || ''
//       }));
//     }
//   }, [user]);

//   useEffect(() => {
//     const checkMyApplicationStatus = async () => {
//       if (!user?.email) return;
      
//       setFetchingStatus(true);
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admission/my-status?email=${user.email}`);
//         const data = await res.json();
        
//         if (res.ok && data.success && data.data) {
//           setMyApplication(data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching application status:", err);
//       } finally {
//         setFetchingStatus(false);
//       }
//     };

//     checkMyApplicationStatus();
//   }, [user?.email]);

//   const showGroupSelect = ['Class 9', 'Class 10'].includes(formData.applyingClass);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => {
//       const updated = { ...prev, [name]: value };
//       if (name === 'applyingClass' && !['Class 9', 'Class 10'].includes(value)) {
//         updated.group = 'General';
//       }
//       return updated;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMsg('');

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admission/apply`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await res.json();

//       if (res.ok && data.success) {
//         setSuccessData(data.data);
//         setMyApplication(data.data); 
//       } else {
//         setErrorMsg(data.message || 'Failed to submit application.');
//       }
//     } catch (err) {
//       console.error('Submission Error:', err);
//       setErrorMsg('Something went wrong! Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Status Badge Helper
//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'Approved':
//         return 'bg-green-500/20 text-green-400 border-green-500/30';
//       case 'Rejected':
//         return 'bg-red-500/20 text-red-400 border-red-500/30';
//       default:
//         return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
//     }
//   };

//   const teachers = [
//     { name: 'Dr. Rafiqul Islam', role: 'Headmaster', subject: 'Mathematics (Class 9-10)' },
//     { name: 'Nusrat Jahan', role: 'Senior Teacher', subject: 'English & Literature (Class 6-8)' },
//     { name: 'Anwar Hossain', role: 'Assistant Teacher', subject: 'General Science (Class 6-10)' },
//     { name: 'Sharmin Akter', role: 'ICT Specialist', subject: 'ICT & Computing (Class 6-10)' }
//   ];

//   return (
//     <div className="min-h-screen bg-[#0b0f17] text-gray-100 font-sans">
      
//       {/* 1. Hero Section */}
//       <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#111827] to-[#0b0f17] border-b border-gray-800 text-center">
//         <div className="max-w-4xl mx-auto space-y-6">
//           <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
//             <FiClock /> Admissions Open for Session 2026
//           </span>
//           <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
//             Build Your Bright Future With <span className="text-blue-500">Quality Education</span>
//           </h1>
//           <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
//             We provide standard academic learning, modern computer labs, dynamic faculty, and an environment designed for modern learners.
//           </p>
//           <div className="pt-4">
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/30 text-lg"
//             >
//               {!user ? 'Apply Online Now' : myApplication ? 'View Application Status' : 'Apply Online Now'}
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* 2. Admission Guidelines & Requirements */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
//             <FiCheckCircle className="text-blue-500" /> Admission Requirements & Instructions
//           </h2>
//           <p className="text-gray-400 text-sm mt-2">Please read carefully before opening the application form.</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl space-y-3">
//             <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl font-bold">1</div>
//             <h3 className="font-bold text-lg text-white">Class Eligibility</h3>
//             <p className="text-sm text-gray-400">Applications are open for Class 6 through Class 10. Class 9 and 10 students must select a specific group (Science, Arts, or Commerce).</p>
//           </div>

//           <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl space-y-3">
//             <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl font-bold">2</div>
//             <h3 className="font-bold text-lg text-white">Required Documents</h3>
//             <p className="text-sm text-gray-400">Keep applicant's details, previous school academic result/GPA, valid guardian phone number, and a photo link handy.</p>
//           </div>

//           <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl space-y-3">
//             <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl font-bold">3</div>
//             <h3 className="font-bold text-lg text-white">Application ID & Tracking</h3>
//             <p className="text-sm text-gray-400">Upon successful submission, an official Application ID will be generated automatically for future verification and tracking.</p>
//           </div>
//         </div>
//       </section>

//       {/* 3. Our Key Faculty & Teachers */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-gray-800/60">
//         <div className="text-center mb-12">
//           <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
//             <FiUsers className="text-blue-500" /> Meet Our Experienced Teachers
//           </h2>
//           <p className="text-gray-400 text-sm mt-2">Dedicated educators guiding students to success.</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {teachers.map((item, index) => (
//             <div key={index} className="bg-[#111827] border border-gray-800 p-5 rounded-2xl text-center space-y-2 hover:border-blue-500/40 transition">
//               <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center text-gray-400 text-2xl font-bold border border-gray-700">
//                 <FiUser />
//               </div>
//               <h3 className="font-bold text-white text-base mt-2">{item.name}</h3>
//               <p className="text-xs text-blue-400 font-medium">{item.role}</p>
//               <p className="text-xs text-gray-400">{item.subject}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* 4. Bottom Call To Action Banner */}
//       <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto my-12 bg-blue-600/10 border border-blue-500/30 rounded-3xl text-center space-y-4">
//         <h2 className="text-2xl font-bold text-white">Ready to Join Our Academic Family?</h2>
//         <p className="text-sm text-gray-300 max-w-lg mx-auto">Click below to open the official online admission application form.</p>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/30 text-sm"
//         >
//           {!user ? 'Open Admission Form' : myApplication ? 'Check Status' : 'Open Admission Form'}
//         </button>
//       </section>


//       {/* ================= MODAL FORM / STATUS VIEW ================= */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
//           <div className="relative w-full max-w-3xl bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
//             {/* Modal Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#172033]">
//               <h2 className="text-lg font-bold text-white flex items-center gap-2">
//                 <FiBookOpen className="text-blue-500" /> 
//                 {myApplication ? 'My Application Status' : 'Online Admission Application'}
//               </h2>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-400 hover:text-white p-1 rounded-lg transition"
//               >
//                 <FiX className="text-xl" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 overflow-y-auto space-y-6">
              
//               {/* ৪.১ ইউজার অনিবন্ধিত/লগইন না করা থাকলে এই কার্ড দেখাবে */}
//               {!user && !isSessionLoading ? (
//                 <div className="text-center py-10 space-y-4">
//                   <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto">
//                     <FiLogIn />
//                   </div>
//                   <h3 className="text-xl font-bold text-white">Login Required</h3>
//                   <p className="text-sm text-gray-400 max-w-sm mx-auto">
//                     You must be registered and logged in to submit an admission application or check status.
//                   </p>
//                   <button
//                     onClick={() => router.push('/login?callbackUrl=/admission')}
//                     className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition"
//                   >
//                     Go to Login Page
//                   </button>
//                 </div>
//               ) : fetchingStatus || isSessionLoading ? (
//                 /* ৪.২ লোডিং স্টেট */
//                 <div className="flex flex-col items-center justify-center py-12 space-y-3">
//                   <FiLoader className="animate-spin text-3xl text-blue-500" />
//                   <p className="text-sm text-gray-400">Checking session & status...</p>
//                 </div>
//               ) : myApplication ? (
//                 /* ৪.৩ আগে আবেদন করা থাকলে স্ট্যাটাস কার্ড দেখাবে */
//                 <div className="bg-[#1a2332] border border-gray-700 p-6 rounded-2xl space-y-5">
//                   <div className="flex items-center justify-between border-b border-gray-700 pb-4">
//                     <div>
//                       <p className="text-xs text-gray-400">Application ID</p>
//                       <p className="text-xl font-mono font-bold text-blue-400">{myApplication.applicationId}</p>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(myApplication.status)}`}>
//                       {myApplication.status}
//                     </span>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
//                     <div>
//                       <p className="text-xs text-gray-500">Applicant Name</p>
//                       <p className="font-semibold text-white">{myApplication.applicantName}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Applying Class</p>
//                       <p className="font-semibold text-white">{myApplication.applyingClass}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Group</p>
//                       <p className="font-semibold text-white">{myApplication.group}</p>
//                     </div>
//                   </div>

//                   {myApplication.adminRemarks && (
//                     <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
//                       <strong>Admin Remarks:</strong> {myApplication.adminRemarks}
//                     </div>
//                   )}

//                   <div className="pt-2 text-center">
//                     <button 
//                       onClick={() => setIsModalOpen(false)}
//                       className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold transition"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               ) : successData ? (
//                 /* ৪.৪ সদ্য ফর্ম সাবমিট করার পর কনফার্মেশন স্ক্রিন */
//                 <div className="bg-green-500/10 border border-green-500/30 p-8 rounded-2xl text-center space-y-4">
//                   <div className="flex justify-center text-green-400 text-5xl mb-2">
//                     <FiCheckCircle />
//                   </div>
//                   <h2 className="text-2xl font-bold text-green-400">Application Submitted Successfully!</h2>
//                   <div className="bg-[#1f2937] p-6 rounded-xl max-w-md mx-auto text-left space-y-2 text-sm border border-gray-700">
//                     <p><strong className="text-gray-400">Application ID:</strong> <span className="text-blue-400 font-mono font-bold">{successData.applicationId}</span></p>
//                     <p><strong className="text-gray-400">Applicant Name:</strong> {successData.applicantName}</p>
//                     <p><strong className="text-gray-400">Applied Class:</strong> {successData.applyingClass}</p>
//                     <p><strong className="text-gray-400">Group:</strong> {successData.group}</p>
//                     <p><strong className="text-gray-400">Status:</strong> <span className="bg-yellow-500/20 text-yellow-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">{successData.status}</span></p>
//                   </div>
//                   <button 
//                     onClick={() => { setSuccessData(null); setIsModalOpen(false); }}
//                     className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition text-white"
//                   >
//                     Done & Close
//                   </button>
//                 </div>
//               ) : (
//                 /* ৪.৫ নতুন ইউজার এবং আবেদন না করে থাকলে ফর্ম দেখাবে */
//                 <form onSubmit={handleSubmit} className="space-y-6">
                  
//                   {errorMsg && (
//                     <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
//                       <FiAlertCircle /> {errorMsg}
//                     </div>
//                   )}

//                   {/* 1. Student Information */}
//                   <div>
//                     <h3 className="text-sm font-bold text-blue-400 mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
//                       <FiUser /> 1. Student Information
//                     </h3>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <label className="block mb-1 text-gray-300">Full Name *</label>
//                         <div className="relative">
//                           <FiUser className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="text" name="applicantName" required value={formData.applicantName} onChange={handleChange} placeholder="John Doe" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block mb-1 text-gray-300">Date of Birth *</label>
//                         <div className="relative">
//                           <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block mb-1 text-gray-300">Gender *</label>
//                         <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 focus:border-blue-500 outline-none">
//                           <option value="Male">Male</option>
//                           <option value="Female">Female</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block mb-1 text-gray-300">Email *</label>
//                         <div className="relative">
//                           <FiMail className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="email" name="email" required readOnly={!!user?.email} value={formData.email} onChange={handleChange} placeholder="student@example.com" className={`w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none ${user?.email ? 'opacity-70 cursor-not-allowed' : ''}`} />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block mb-1 text-gray-300">Phone Number *</label>
//                         <div className="relative">
//                           <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="017xxxxxxxx" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block mb-1 text-gray-300">Profile Photo URL</label>
//                         <div className="relative">
//                           <FiImage className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="url" name="profilePhoto" placeholder="https://..." value={formData.profilePhoto} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>

//                       <div className="sm:col-span-2">
//                         <label className="block mb-1 text-gray-300">Previous School Name *</label>
//                         <div className="relative">
//                           <FiBookOpen className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="text" name="previousSchool" required value={formData.previousSchool} onChange={handleChange} placeholder="ABC High School" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* 2. Academic Information */}
//                   <div>
//                     <h3 className="text-sm font-bold text-blue-400 mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
//                       <FiLayers /> 2. Academic Information
//                     </h3>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <label className="block mb-1 text-gray-300">Applying Class *</label>
//                         <select name="applyingClass" value={formData.applyingClass} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 focus:border-blue-500 outline-none">
//                           <option value="Class 6">Class 6</option>
//                           <option value="Class 7">Class 7</option>
//                           <option value="Class 8">Class 8</option>
//                           <option value="Class 9">Class 9</option>
//                           <option value="Class 10">Class 10</option>
//                         </select>
//                       </div>

//                       {showGroupSelect && (
//                         <div>
//                           <label className="block mb-1 text-gray-300">Group *</label>
//                           <select name="group" value={formData.group} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 focus:border-blue-500 outline-none">
//                             <option value="Science">Science</option>
//                             <option value="Arts">Arts</option>
//                             <option value="Commerce">Commerce</option>
//                           </select>
//                         </div>
//                       )}

//                       <div>
//                         <label className="block mb-1 text-gray-300">Previous Class *</label>
//                         <input type="text" name="previousClass" required value={formData.previousClass} onChange={handleChange} placeholder="Class 5 / Class 8" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 focus:border-blue-500 outline-none" />
//                       </div>

//                       <div>
//                         <label className="block mb-1 text-gray-300">Previous Result (GPA/Grade) *</label>
//                         <div className="relative">
//                           <FiAward className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="text" name="previousResult" required value={formData.previousResult} onChange={handleChange} placeholder="5.00 or A+" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* 3. Guardian Information */}
//                   <div>
//                     <h3 className="text-sm font-bold text-blue-400 mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
//                       <FiUsers /> 3. Guardian Information
//                     </h3>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <label className="block mb-1 text-gray-300">Father's Name *</label>
//                         <div className="relative">
//                           <FiUser className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="text" name="fatherName" required value={formData.fatherName} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block mb-1 text-gray-300">Mother's Name *</label>
//                         <div className="relative">
//                           <FiUser className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="text" name="motherName" required value={formData.motherName} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block mb-1 text-gray-300">Guardian Phone *</label>
//                         <div className="relative">
//                           <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="text" name="guardianPhone" required value={formData.guardianPhone} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block mb-1 text-gray-300">Guardian Email</label>
//                         <div className="relative">
//                           <FiMail className="absolute left-3 top-3.5 text-gray-400" />
//                           <input type="email" name="guardianEmail" value={formData.guardianEmail} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
//                         </div>
//                       </div>

//                       <div className="sm:col-span-2">
//                         <label className="block mb-1 text-gray-300">Present Address *</label>
//                         <div className="relative">
//                           <FiHome className="absolute left-3 top-3.5 text-gray-400" />
//                           <textarea name="address" rows="2" required value={formData.address} onChange={handleChange} placeholder="Village/City, District..." className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none resize-none"></textarea>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
//                   >
//                     <FiSend /> {loading ? 'Submitting Application...' : 'Submit Admission Application'}
//                   </button>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdmissionPage;


"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { authClient } from "@/lib/auth-client"; 
import { 
  FiBookOpen, 
  FiCheckCircle, 
  FiUsers, 
  FiAward, 
  FiClock, 
  FiX, 
  FiSend, 
  FiUser, 
  FiCalendar, 
  FiMail, 
  FiPhone, 
  FiImage, 
  FiHome, 
  FiLayers,
  FiAlertCircle,
  FiLoader,
  FiLogIn,
  FiInfo
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdmissionPage = () => {
  const router = useRouter();

  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const user = session?.user;
  console.log("user to", user);
  const userRole = user?.role?.toLowerCase();
  const isAdminOrTeacher = userRole === 'admin' || userRole === 'teacher';
  const studentId = user?.studentId;
  
  console.log("student", studentId)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(false);
  
  const [myApplication, setMyApplication] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    applicantName: '',
    dateOfBirth: '',
    gender: 'Male',
    email: '',
    phone: '',
    profilePhoto: '',
    previousSchool: '',
    applyingClass: 'Class 6',
    group: 'General',
    previousClass: '',
    previousResult: '',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    guardianEmail: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        applicantName: user.name || '',
        email: user.email || '',
        profilePhoto: user.image || ''
      }));
    }
  }, [user]);


  useEffect(() => {
    const checkMyApplicationStatus = async () => {
      if (!user?.email || isAdminOrTeacher || studentId) return;
      
      setFetchingStatus(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admission/my-status?email=${user.email}`);
        const data = await res.json();
        
        if (res.ok && data.success && data.data) {
          setMyApplication(data.data);
        }
      } catch (err) {
        console.error("Error fetching application status:", err);
      } finally {
        setFetchingStatus(false);
      }
    };

    checkMyApplicationStatus();
  }, [user?.email, isAdminOrTeacher, studentId]);

  const showGroupSelect = ['Class 9', 'Class 10'].includes(formData.applyingClass);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'applyingClass' && !['Class 9', 'Class 10'].includes(value)) {
        updated.group = 'General';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admission/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessData(data.data);
        setMyApplication(data.data);
        toast.success("Apply Successfully") 
      } else {
        setErrorMsg(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Submission Error:', err);
      setErrorMsg('Something went wrong! Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const teachers = [
    { name: 'Dr. Rafiqul Islam', role: 'Headmaster', subject: 'Mathematics (Class 9-10)' },
    { name: 'Nusrat Jahan', role: 'Senior Teacher', subject: 'English & Literature (Class 6-8)' },
    { name: 'Anwar Hossain', role: 'Assistant Teacher', subject: 'General Science (Class 6-10)' },
    { name: 'Sharmin Akter', role: 'ICT Specialist', subject: 'ICT & Computing (Class 6-10)' }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#111827] to-[#0b0f17] border-b border-gray-800 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FiClock /> Admissions Open for Session 2026
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Build Your Bright Future With <span className="text-blue-500">Quality Education</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            We provide standard academic learning, modern computer labs, dynamic faculty, and an environment designed for modern learners.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/30 text-lg"
            >
              Apply Online Now
            </button>
          </div>
        </div>
      </section>

      {/* 2. Admission Guidelines & Requirements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
            <FiCheckCircle className="text-blue-500" /> Admission Requirements & Instructions
          </h2>
          <p className="text-gray-400 text-sm mt-2">Please read carefully before opening the application form.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl font-bold">1</div>
            <h3 className="font-bold text-lg text-white">Class Eligibility</h3>
            <p className="text-sm text-gray-400">Applications are open for Class 6 through Class 10. Class 9 and 10 students must select a specific group (Science, Arts, or Commerce).</p>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl font-bold">2</div>
            <h3 className="font-bold text-lg text-white">Required Documents</h3>
            <p className="text-sm text-gray-400">Keep applicant's details, previous school academic result/GPA, valid guardian phone number, and a photo link handy.</p>
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl space-y-3">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl font-bold">3</div>
            <h3 className="font-bold text-lg text-white">Application ID & Tracking</h3>
            <p className="text-sm text-gray-400">Upon successful submission, an official Application ID will be generated automatically for future verification and tracking.</p>
          </div>
        </div>
      </section>

      {/* 3. Our Key Faculty & Teachers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-gray-800/60">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
            <FiUsers className="text-blue-500" /> Meet Our Experienced Teachers
          </h2>
          <p className="text-gray-400 text-sm mt-2">Dedicated educators guiding students to success.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((item, index) => (
            <div key={index} className="bg-[#111827] border border-gray-800 p-5 rounded-2xl text-center space-y-2 hover:border-blue-500/40 transition">
              <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center text-gray-400 text-2xl font-bold border border-gray-700">
                <FiUser />
              </div>
              <h3 className="font-bold text-white text-base mt-2">{item.name}</h3>
              <p className="text-xs text-blue-400 font-medium">{item.role}</p>
              <p className="text-xs text-gray-400">{item.subject}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Bottom Call To Action Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto my-12 bg-blue-600/10 border border-blue-500/30 rounded-3xl text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Ready to Join Our Academic Family?</h2>
        <p className="text-sm text-gray-300 max-w-lg mx-auto">Click below to open the official online admission application form.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/30 text-sm"
        >
          Open Admission Form
        </button>
      </section>


      {/* ================= MODAL FORM / STATUS VIEW ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#172033]">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FiBookOpen className="text-blue-500" /> Online Admission Application
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* ১. লগইন না থাকলে */}
              {!user && !isSessionLoading ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto">
                    <FiLogIn />
                  </div>
                  <h3 className="text-xl font-bold text-white">Login Required</h3>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    You must be registered and logged in to submit an admission application.
                  </p>
                  <button
                    onClick={() => router.push('/login?callbackUrl=/admission')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition"
                  >
                    Go to Login Page
                  </button>
                </div>
              ) : fetchingStatus || isSessionLoading ? (
                /* লোডিং স্টেট */
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <FiLoader className="animate-spin text-3xl text-blue-500" />
                  <p className="text-sm text-gray-400">Checking status...</p>
                </div>
              ) : isAdminOrTeacher ? (
                /* ২. Admin বা Teacher হলে Red Error Message দেখাবে */
                <div className="text-center py-8 px-4 space-y-4">
                  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto border border-red-500/20">
                    <FiAlertCircle />
                  </div>
                  <h3 className="text-xl font-bold text-red-400">Access Restricted</h3>
                  <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 p-4 rounded-xl max-w-md mx-auto">
                    অ্যাডমিন বা টিচারদের জন্য আবেদন করা প্রযোজ্য নয়।
                  </p>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold transition mt-2"
                  >
                    Close
                  </button>
                </div>
              ) : studentId ? (
                /* ৩. ইতোমধ্যে Student ID থাকলে (Active Student) Alert Message দেখাবে */
                <div className="text-center py-8 px-4 space-y-4">
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center text-3xl mx-auto border border-blue-500/20">
                    <FiInfo />
                  </div>
                  <h3 className="text-xl font-bold text-blue-400">Already Registered Student</h3>
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl max-w-md mx-auto text-sm text-blue-200">
                    আপনি ইতোমধ্যে একজন অ্যাক্টিভ স্টুডেন্ট <br />
                    <span className="font-mono font-bold text-white text-base">Student ID: {studentId}</span><br />
                    নতুন করে আবেদনের প্রয়োজন নেই।
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold transition mt-2"
                  >
                    Close
                  </button>
                </div>
              ) : myApplication ? (
                /* ৪. আগেই ফর্ম সাবমিট করা থাকলে কিন্তু পন্ডিং থাকলে স্ট্যাটাস দেখাবে */
                <div className="bg-[#1a2332] border border-gray-700 p-6 rounded-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                    <div>
                      <p className="text-xs text-gray-400">Application ID</p>
                      <p className="text-xl font-mono font-bold text-blue-400">{myApplication.applicationId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(myApplication.status)}`}>
                      {myApplication.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                      <p className="text-xs text-gray-500">Applicant Name</p>
                      <p className="font-semibold text-white">{myApplication.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Applying Class</p>
                      <p className="font-semibold text-white">{myApplication.applyingClass}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Group</p>
                      <p className="font-semibold text-white">{myApplication.group}</p>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : successData ? (
                /* ৫. সদ্য ফর্ম সাবমিট করার পর কনফার্মেশন স্ক্রিন */
                <div className="bg-green-500/10 border border-green-500/30 p-8 rounded-2xl text-center space-y-4">
                  <div className="flex justify-center text-green-400 text-5xl mb-2">
                    <FiCheckCircle />
                  </div>
                  <h2 className="text-2xl font-bold text-green-400">Application Submitted Successfully!</h2>
                  <div className="bg-[#1f2937] p-6 rounded-xl max-w-md mx-auto text-left space-y-2 text-sm border border-gray-700">
                    <p><strong className="text-gray-400">Application ID:</strong> <span className="text-blue-400 font-mono font-bold">{successData.applicationId}</span></p>
                    <p><strong className="text-gray-400">Applicant Name:</strong> {successData.applicantName}</p>
                    <p><strong className="text-gray-400">Applied Class:</strong> {successData.applyingClass}</p>
                    <p><strong className="text-gray-400">Group:</strong> {successData.group}</p>
                  </div>
                  <button 
                    onClick={() => { setSuccessData(null); setIsModalOpen(false); }}
                    className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition text-white"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                /* ৬. নতুন সাধারণ স্টুডেন্ট হলে ফর্মে এক্সেস পাবে */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {errorMsg && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
                      <FiAlertCircle /> {errorMsg}
                    </div>
                  )}

                  {/* 1. Student Information */}
                  <div>
                    <h3 className="text-sm font-bold text-blue-400 mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                      <FiUser /> 1. Student Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block mb-1 text-gray-300">Full Name *</label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="text" name="applicantName" required value={formData.applicantName} onChange={handleChange} placeholder="John Doe" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-300">Date of Birth *</label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-300">Gender *</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 focus:border-blue-500 outline-none">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-300">Email *</label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="email" name="email" required readOnly={!!user?.email} value={formData.email} onChange={handleChange} placeholder="student@example.com" className={`w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none ${user?.email ? 'opacity-70 cursor-not-allowed' : ''}`} />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-300">Phone Number *</label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="017xxxxxxxx" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-300">Profile Photo URL</label>
                        <div className="relative">
                          <FiImage className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="url" name="profilePhoto" placeholder="https://..." value={formData.profilePhoto} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block mb-1 text-gray-300">Previous School Name *</label>
                        <div className="relative">
                          <FiBookOpen className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="text" name="previousSchool" required value={formData.previousSchool} onChange={handleChange} placeholder="ABC High School" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Academic Information */}
                  <div>
                    <h3 className="text-sm font-bold text-blue-400 mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                      <FiLayers /> 2. Academic Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block mb-1 text-gray-300">Applying Class *</label>
                        <select name="applyingClass" value={formData.applyingClass} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 focus:border-blue-500 outline-none">
                          <option value="Class 6">Class 6</option>
                          <option value="Class 7">Class 7</option>
                          <option value="Class 8">Class 8</option>
                          <option value="Class 9">Class 9</option>
                          <option value="Class 10">Class 10</option>
                        </select>
                      </div>

                      {showGroupSelect && (
                        <div>
                          <label className="block mb-1 text-gray-300">Group *</label>
                          <select name="group" value={formData.group} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 focus:border-blue-500 outline-none">
                            <option value="Science">Science</option>
                            <option value="Arts">Arts</option>
                            <option value="Commerce">Commerce</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block mb-1 text-gray-300">Previous Class *</label>
                        <input type="text" name="previousClass" required value={formData.previousClass} onChange={handleChange} placeholder="Class 5 / Class 8" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl p-2.5 focus:border-blue-500 outline-none" />
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-300">Previous Result (GPA/Grade) *</label>
                        <div className="relative">
                          <FiAward className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="text" name="previousResult" required value={formData.previousResult} onChange={handleChange} placeholder="5.00 or A+" className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Guardian Information */}
                  <div>
                    <h3 className="text-sm font-bold text-blue-400 mb-3 border-b border-gray-800 pb-2 flex items-center gap-2">
                      <FiUsers /> 3. Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block mb-1 text-gray-300">Father's Name *</label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="text" name="fatherName" required value={formData.fatherName} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-300">Mother's Name *</label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="text" name="motherName" required value={formData.motherName} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-300">Guardian Phone *</label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="text" name="guardianPhone" required value={formData.guardianPhone} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-1 text-gray-300">Guardian Email</label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                          <input type="email" name="guardianEmail" value={formData.guardianEmail} onChange={handleChange} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none" />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block mb-1 text-gray-300">Present Address *</label>
                        <div className="relative">
                          <FiHome className="absolute left-3 top-3.5 text-gray-400" />
                          <textarea name="address" rows="2" required value={formData.address} onChange={handleChange} placeholder="Village/City, District..." className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 p-2.5 focus:border-blue-500 outline-none resize-none"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <FiSend /> {loading ? 'Submitting Application...' : 'Submit Admission Application'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdmissionPage;



