
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, CheckCircle, Clock, AlertCircle, 
  Plus, Edit, Trash2, Search, RefreshCw, Layers 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function FeeManagement() {
  // States
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Edit Mode States
  const [editId, setEditId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tuition Fee',
    amount: '',
    className: 'Class 6',
    group: 'All',
    dueDate: '',
  });

  const isGroupApplicable = formData.className === 'Class 9' || formData.className === 'Class 10';

  // Fetch Data from Server
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: tokenData } = await authClient.token();
      const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${tokenData?.token}`,
      };

      const [feesRes, paymentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/fees`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/payments`, { headers }),
      ]);

      if (feesRes.ok) {
        const feesData = await feesRes.json();
        setFees(Array.isArray(feesData) ? feesData : feesData.fees || feesData.data || []);
      }
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.payments || paymentsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load fee management data');
      setFees([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Form Submit (Create / Edit Fee)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: tokenData } = await authClient.token();
      const url = editId 
        ? `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/fees/${editId}`
        : `${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/fees`;
      
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({
          ...formData,
          group: isGroupApplicable ? formData.group : 'All',
        }),
      });

      if (res.ok) {
        toast.success(editId ? 'Fee updated successfully!' : 'Fee structure created!');
        setFormData({ title: '', category: 'Tuition Fee', amount: '', className: 'Class 6', group: 'All', dueDate: '' });
        setEditId(null);
        fetchData();
      } else {
        toast.error('Failed to save fee structure');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  };

  // Edit Click Handler
  const handleEditClick = (fee) => {
    setEditId(fee._id);
    setFormData({
      title: fee.title,
      category: fee.category || 'Tuition Fee',
      amount: fee.amount,
      className: fee.className,
      group: fee.group || 'All',
      dueDate: fee.dueDate ? fee.dueDate.split('T')[0] : '',
    });
  };

  // Delete Fee Handler
  const handleDeleteFee = async (id) => {
    if (!confirm('Are you sure you want to delete this fee structure?')) return;
    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/fees/${id}`, {
        method: 'DELETE',
        headers: { authorization: `Bearer ${tokenData?.token}` },
      });

      if (res.ok) {
        toast.success('Fee structure deleted!');
        fetchData();
      } else {
        toast.error('Failed to delete fee');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting fee');
    }
  };

  // Mark Payment Status as Paid
  const handleMarkAsPaid = async (paymentId) => {
    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({ status: 'Paid' }),
      });

      if (res.ok) {
        toast.success('Payment status updated to Paid!');
        fetchData();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  };

  // Toggle Status Cycle
  const handleStatusToggle = async (payment) => {
    let newStatus = 'Paid';
    if (payment.status === 'Paid') newStatus = 'Unpaid';
    else if (payment.status === 'Unpaid') newStatus = 'Pending';
    else if (payment.status === 'Pending') newStatus = 'Paid';

    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/admin/payments/${payment._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`);
        fetchData();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  };

  // Filtered Payments Calculation (Safeguarded)
  const filteredPayments = useMemo(() => {
    if (!Array.isArray(payments)) return [];

    return payments.filter((payment) => {
      const matchesSearch = 
        payment.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.feeTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClass = filterClass === 'All' || payment.className === filterClass;
      const matchesStatus = filterStatus === 'All' || payment.status === filterStatus;

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [payments, searchQuery, filterClass, filterStatus]);

  // Analytics Calculation (Safeguarded)
  const stats = useMemo(() => {
    if (!Array.isArray(payments)) return { totalCollected: 0, totalPending: 0, totalUnpaid: 0 };

    const totalCollected = payments.filter(p => p.status === 'Paid').reduce((acc, p) => acc + Number(p.amount || 0), 0);
    const totalPending = payments.filter(p => p.status === 'Pending').reduce((acc, p) => acc + Number(p.amount || 0), 0);
    const totalUnpaid = payments.filter(p => p.status === 'Unpaid').reduce((acc, p) => acc + Number(p.amount || 0), 0);

    return { totalCollected, totalPending, totalUnpaid };
  }, [payments]);

  // Pie Chart Data
  const chartData = [
    { name: 'Paid', value: stats.totalCollected, color: '#10b981' },
    { name: 'Pending', value: stats.totalPending, color: '#f59e0b' },
    { name: 'Unpaid', value: stats.totalUnpaid, color: '#ef4444' },
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-indigo-400" /> Fee Management Dashboard
          </h1>
          <p className="text-slate-400 text-sm">Manage class fees, payment statuses, and analytics</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm border border-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Collected (Paid)</p>
            <p className="text-2xl font-bold text-emerald-400">৳ {stats.totalCollected.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Pending</p>
            <p className="text-2xl font-bold text-amber-400">৳ {stats.totalPending.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Unpaid</p>
            <p className="text-2xl font-bold text-rose-400">৳ {stats.totalUnpaid.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Form and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create / Edit Fee Form */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 p-6 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            {editId ? <Edit className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
            {editId ? 'Edit Fee Structure' : 'Create New Fee Structure'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Fee Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Monthly Tuition Fee"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Exam Fee">Exam Fee</option>
                <option value="Admission Fee">Admission Fee</option>
                <option value="Session Fee">Session Fee</option>
                <option value="Lab Fee">Lab Fee</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Amount (BDT)</label>
              <input
                type="number"
                required
                placeholder="e.g. 1500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Class</label>
              <select
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              >
                {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {isGroupApplicable && (
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Group</label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Groups</option>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-end justify-end gap-3 pt-2">
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setFormData({ title: '', category: 'Tuition Fee', amount: '', className: 'Class 6', group: 'All', dueDate: '' });
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 py-2 rounded-lg transition font-medium"
              >
                {editId ? 'Update Fee' : 'Save Fee Structure'}
              </button>
            </div>
          </form>
        </div>

        {/* Analytics Chart */}
        <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-xl flex flex-col justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" /> Collection Ratio
          </h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment Tracker & Management Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Payment Status Tracker</h2>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search student or fee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            >
              <option value="All">All Classes</option>
              {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 bg-slate-900/50">
                <th className="p-3">Student Name</th>
                <th className="p-3">Class</th>
                <th className="p-3">Fee Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-400">Loading payment records...</td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-400">No payment records found.</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-medium text-slate-200">{payment.studentName}</td>
                    <td className="p-3 text-slate-400">{payment.className}</td>
                    <td className="p-3 text-slate-400">{payment.feeTitle}</td>
                    <td className="p-3 text-slate-400">
                      <span className="bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded text-xs">
                        {payment.category || 'Tuition Fee'}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-200">৳ {payment.amount}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'Paid' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : payment.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status !== 'Paid' && (
                          <button
                            onClick={() => handleMarkAsPaid(payment._id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 shadow-sm"
                            title="Mark as Paid"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Make Paid
                          </button>
                        )}

                        <button
                          onClick={() => handleStatusToggle(payment)}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-2 py-1 rounded-md transition"
                          title="Cycle Status"
                        >
                          Toggle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}