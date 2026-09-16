// "use client";
// import { useEffect, useState } from "react";
// import { 
//   FiDollarSign, 
//   FiCheckCircle, 
//   FiClock, 
//   FiSearch, 
//   FiFilter, 
//   FiPlus, 
//   FiUserCheck 
// } from "react-icons/fi";

// export default function AdminFeesPage() {
//   const [selectedDept, setSelectedDept] = useState("All");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedFee, setSelectedFee] = useState(null);

//   // Fetch Fee Records
//   const fetchFees = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/admin/fees?department=${selectedDept}&status=${selectedStatus}&search=${searchTerm}`
//       );
//       const data = await res.json();
//       if (data.success) {
//         setRecords(data.records || []);
//       }
//     } catch (err) {
//       console.error("Fee fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFees();
//   }, [selectedDept, selectedStatus, searchTerm]);

//   // Handle Mark as Paid
//   const handlePayment = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/admin/fees/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: "Paid", paymentMethod: "Cash" }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setSelectedFee(null);
//         fetchFees();
//       }
//     } catch (err) {
//       console.error("Payment error:", err);
//     }
//   };

//   // Calculations for Stat Cards
//   const totalCollected = records
//     .filter((r) => r.status === "Paid")
//     .reduce((sum, r) => sum + (r.amount || 0), 0);

//   const totalPending = records
//     .filter((r) => r.status === "Pending")
//     .reduce((sum, r) => sum + (r.amount || 0), 0);

//   return (
//     <div className="space-y-6 pb-10">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2.5">
//           <FiDollarSign className="text-primary" /> Fees & Accounts Management
//         </h1>
//         <p className="text-xs sm:text-sm text-base-content/60 mt-1">
//           Track student fee collections, pending balances, and overall account ledgers.
//         </p>
//       </div>

//       {/* Summary Stat Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//         <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
//           <div className="p-3 bg-success/10 text-success rounded-xl">
//             <FiCheckCircle size={24} />
//           </div>
//           <div>
//             <p className="text-xs text-base-content/60 font-medium">Total Collected</p>
//             <p className="text-xl sm:text-2xl font-bold text-success">৳ {totalCollected}</p>
//           </div>
//         </div>

//         <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
//           <div className="p-3 bg-error/10 text-error rounded-xl">
//             <FiClock size={24} />
//           </div>
//           <div>
//             <p className="text-xs text-base-content/60 font-medium">Pending Dues</p>
//             <p className="text-xl sm:text-2xl font-bold text-error">৳ {totalPending}</p>
//           </div>
//         </div>

//         <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
//           <div className="p-3 bg-primary/10 text-primary rounded-xl">
//             <FiUserCheck size={24} />
//           </div>
//           <div>
//             <p className="text-xs text-base-content/60 font-medium">Total Records</p>
//             <p className="text-xl sm:text-2xl font-bold text-base-content">{records.length} Transactions</p>
//           </div>
//         </div>
//       </div>

//       {/* Filter and Search Bar */}
//       <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
//         <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
//           {/* Department Filter */}
//           <div className="w-full sm:w-auto">
//             <select
//               value={selectedDept}
//               onChange={(e) => setSelectedDept(e.target.value)}
//               className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
//             >
//               <option value="All">All Departments</option>
//               <option value="Electrical Technology">Electrical Tech</option>
//               <option value="Computer Technology">Computer Tech</option>
//               <option value="Civil Technology">Civil Tech</option>
//             </select>
//           </div>

//           {/* Status Filter */}
//           <div className="w-full sm:w-auto">
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
//             >
//               <option value="All">All Status</option>
//               <option value="Paid">Paid</option>
//               <option value="Pending">Pending</option>
//             </select>
//           </div>
//         </div>

//         {/* Search Input */}
//         <div className="relative w-full md:w-72">
//           <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
//           <input
//             type="text"
//             placeholder="Search by student or ID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="input input-bordered w-full pl-10 rounded-xl text-sm focus:outline-none focus:border-primary"
//           />
//         </div>
//       </div>

//       {/* Fee Records Table */}
//       <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center p-12 gap-3">
//             <span className="loading loading-spinner text-primary"></span>
//             <p className="text-sm text-base-content/60">Fetching financial logs...</p>
//           </div>
//         ) : records.length === 0 ? (
//           <div className="text-center p-12 text-base-content/60 space-y-2">
//             <FiClock size={32} className="mx-auto text-base-content/30" />
//             <p className="font-semibold text-sm">No fee records found.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="table w-full">
//               <thead className="bg-base-200/50 text-base-content/70 text-xs font-semibold uppercase">
//                 <tr>
//                   <th>Student Info</th>
//                   <th>Fee Type</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-base-200 text-sm">
//                 {records.map((item) => (
//                   <tr key={item._id} className="hover:bg-base-200/30 transition-colors">
//                     <td>
//                       <div className="font-bold text-base-content">{item.studentName}</div>
//                       <div className="text-xs text-base-content/60">ID: {item.studentId} | {item.department}</div>
//                     </td>
//                     <td className="font-medium text-base-content/80">{item.feeType}</td>
//                     <td className="font-bold text-base-content">৳ {item.amount}</td>
//                     <td>
//                       <span className={`badge badge-sm font-bold ${
//                         item.status === "Paid" ? "badge-success" : "badge-error"
//                       }`}>
//                         {item.status}
//                       </span>
//                     </td>
//                     <td>
//                       {item.status === "Pending" ? (
//                         <button
//                           onClick={() => handlePayment(item._id)}
//                           className="btn btn-xs btn-primary rounded-lg"
//                         >
//                           Collect Payment
//                         </button>
//                       ) : (
//                         <span className="text-xs text-success font-semibold">Paid on {item.paidAt || "N/A"}</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash2, Edit, Plus, CreditCard, DollarSign, Calendar, Tag, LayerGroup, ArrowRightLeft } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export default function AdminFeesPage() {
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [form, setForm] = useState({
    title: '',
    category: 'Midterm Exam',
    className: 'Class 8',
    group: 'All',
    amount: '',
    dueDate: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feesRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/fees'),
        fetch('http://localhost:5000/api/admin/payments')
      ]);

      const feesData = await feesRes.json();
      const paymentsData = await paymentsRes.json();

      if (feesData.success) setFees(feesData.data);
      if (paymentsData.success) {
        setPayments(paymentsData.payments);
        setPieData(paymentsData.pieChartData);
      }
    } catch (error) {
      console.error("Data Fetching Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId
      ? `http://localhost:5000/api/admin/fees/${editId}`
      : 'http://localhost:5000/api/admin/fees';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (result.success) {
        setForm({ title: '', category: 'Midterm Exam', className: 'Class 8', group: 'All', amount: '', dueDate: '' });
        setEditId(null);
        fetchData();
      } else {
        alert(result.message || 'An error occurred');
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/fees/${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        if (result.success) {
          fetchData();
        }
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };

  const handleEditClick = (fee) => {
    setEditId(fee._id);
    setForm({
      title: fee.title,
      category: fee.category,
      className: fee.className,
      group: fee.group || 'All',
      amount: fee.amount,
      dueDate: fee.dueDate,
    });
  };

  const isGroupApplicable = form.className === 'Class 9' || form.className === 'Class 10';

  return (
    <div className="p-8 bg-[#0f172a] text-slate-100 min-h-screen space-y-8 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <DollarSign className="w-6 h-6" />
            </span>
            Fees & Billing Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure student tuition structures, exam fees, and track bKash payments.</p>
        </div>
      </div>

      {/* --- Grid Layout: Chart & Form --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pie Chart Card */}
        <div className="lg:col-span-6 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              Revenue Distribution by Class
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Visual representation of collected payments per grade level.</p>
          </div>

          <div className="w-full h-72 my-4 flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#1e293b" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => [`৳${value}`, 'Total Revenue']} 
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#94a3b8', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                <ArrowRightLeft className="w-8 h-8 opacity-40" />
                <p className="text-sm">No payment record found</p>
              </div>
            )}
          </div>
        </div>

        {/* Fee Form Card */}
        <div className="lg:col-span-6 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="mb-5 border-b border-slate-800 pb-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              {editId ? 'Update Fee Structure' : 'Create New Fee Structure'}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Fill in the required information to publish a new fee category.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Fee Title
              </label>
              <input
                type="text"
                placeholder="e.g. Midterm Examination Fee 2026"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full bg-[#0f172a] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                >
                  <option value="First Exam">First Exam</option>
                  <option value="Midterm Exam">Midterm Exam</option>
                  <option value="Final Exam">Final Exam</option>
                  <option value="Monthly">Monthly Fee</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Class
                </label>
                <select
                  value={form.className}
                  onChange={(e) => setForm({ ...form, className: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>
            </div>

            {/* Dynamic Group Selector for Class 9 & 10 */}
            {isGroupApplicable && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Academic Group
                </label>
                <select
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value })}
                  className="w-full bg-[#0f172a] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                >
                  <option value="All">All Groups</option>
                  <option value="Science">Science</option>
                  <option value="Humanities">Humanities</option>
                  <option value="Business Studies">Business Studies</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Amount (BDT)
                </label>
                <input
                  type="number"
                  placeholder="500"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition shadow-lg shadow-indigo-600/25"
              >
                {editId ? 'Update Fee' : 'Save Fee Structure'}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm({ title: '', category: 'Midterm Exam', className: 'Class 8', group: 'All', amount: '', dueDate: '' });
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* --- Section: Fee Structure Table --- */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Configured Fee Structures</h2>
          <p className="text-slate-400 text-xs">List of active fee settings available for students.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Group</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {fees.length > 0 ? (
                fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-medium text-white">{fee.title}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-md text-xs font-medium">
                        {fee.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{fee.className}</td>
                    <td className="py-3.5 px-4 text-slate-400">{fee.group || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">৳{fee.amount}</td>
                    <td className="py-3.5 px-4 text-slate-400">{fee.dueDate}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEditClick(fee)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(fee._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-500">
                    No fee structures defined yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Section: Payment Tracking History --- */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-pink-500" /> bKash Payment History
          </h2>
          <p className="text-slate-400 text-xs">Real-time payment logs submitted by students.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Group</th>
                <th className="py-3.5 px-4">Roll</th>
                <th className="py-3.5 px-4">Fee Title</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">bKash TrxID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-medium text-white">{payment.studentName}</td>
                    <td className="py-3.5 px-4">{payment.className}</td>
                    <td className="py-3.5 px-4 text-slate-400">{payment.group || 'N/A'}</td>
                    <td className="py-3.5 px-4">{payment.roll}</td>
                    <td className="py-3.5 px-4 text-slate-300">{payment.feeTitle}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">৳{payment.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-pink-400 font-medium">{payment.paymentMethod || 'bKash'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs bg-slate-900 border border-slate-700/60 px-2 py-1 rounded text-slate-300">
                        {payment.trxID}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
                        {payment.status || 'Paid'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-slate-500">
                    No payment history recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}