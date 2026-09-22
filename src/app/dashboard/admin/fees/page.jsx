
'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash2, Edit, Plus, CreditCard, DollarSign, Calendar, Tag, LayerGroup, ArrowRightLeft } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

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
        fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/fees`),
        fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/payments`)
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
      ? `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/fees/${editId}`
      : `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/fees`;

    try {
       const { data: tokenData,error: tokenError } = await authClient.token();
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
          },
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
         const { data: tokenData,error: tokenError } = await authClient.token();
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/fees/${id}`, {
          method: 'DELETE',

           headers: { "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
          },
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