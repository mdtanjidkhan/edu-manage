'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, DollarSign, Filter, Send, AlertCircle } from 'lucide-react';

export default function StudentPayPage() {
  // Filter States
  const [selectedClass, setSelectedClass] = useState('Class 8');
  const [selectedGroup, setSelectedGroup] = useState('Science');
  
  // Dynamic Data
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal / Payment Form State
  const [selectedFee, setSelectedFee] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [roll, setRoll] = useState('');
  const [trxID, setTrxID] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStudentFees();
  }, [selectedClass, selectedGroup]);

  const fetchStudentFees = async () => {
    setLoading(true);
    try {
      const isGroupApplicable = selectedClass === 'Class 9' || selectedClass === 'Class 10';
      const groupQuery = isGroupApplicable ? `&group=${selectedGroup}` : '';

      const res = await fetch(`http://localhost:5000/api/student/fees?className=${selectedClass}${groupQuery}`);
      const data = await res.json();

      if (data.success) {
        setFees(data.data);
      }
    } catch (error) {
      console.error("Fetch Student Fees Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const paymentPayload = {
      studentName,
      className: selectedClass,
      group: (selectedClass === 'Class 9' || selectedClass === 'Class 10') ? selectedGroup : 'N/A',
      roll,
      feeTitle: selectedFee.title,
      amount: selectedFee.amount,
      trxID
    };

    try {
      const res = await fetch('http://localhost:5000/api/student/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload)
      });

      const result = await res.json();

      if (result.success) {
        setMessage({ type: 'success', text: 'Payment submitted successfully!' });
        setTrxID('');
        setStudentName('');
        setRoll('');
        setTimeout(() => setSelectedFee(null), 2000);
      } else {
        setMessage({ type: 'error', text: result.message || 'Payment failed!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server connection error.' });
    } finally {
      setSubmitting(false);
    }
  };

  const isGroupRequired = selectedClass === 'Class 9' || selectedClass === 'Class 10';

  return (
    <div className="p-8 bg-[#0f172a] text-slate-100 min-h-screen space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="p-2 bg-pink-600/20 text-pink-400 rounded-lg border border-pink-500/30">
            <CreditCard className="w-6 h-6" />
          </span>
          Student Fee Portal & bKash Payment
        </h1>
        <p className="text-slate-400 text-sm mt-1">Select your academic class to view assigned fees and make instant bKash payments.</p>
      </div>

      {/* --- Filter Bar Card --- */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-4 uppercase tracking-wider">
          <Filter className="w-4 h-4" /> Filter Required Fees
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            >
              <option value="Class 6">Class 6</option>
              <option value="Class 7">Class 7</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>

          {isGroupRequired && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Select Group</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="Science">Science</option>
                <option value="Humanities">Humanities</option>
                <option value="Business Studies">Business Studies</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* --- Available Fees List --- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Available Fees for <span className="text-indigo-400">{selectedClass}</span> {isGroupRequired && `(${selectedGroup})`}
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading fees...</div>
        ) : fees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fees.map((fee) => (
              <div key={fee._id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-md text-xs font-medium">
                      {fee.category}
                    </span>
                    <span className="text-xs text-slate-400">Due: {fee.dueDate}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{fee.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Target: {fee.className} {fee.group !== 'N/A' && `(${fee.group})`}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Amount</span>
                    <span className="text-xl font-bold text-emerald-400">৳{fee.amount}</span>
                  </div>
                  <button
                    onClick={() => setSelectedFee(fee)}
                    className="bg-pink-600 hover:bg-pink-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition flex items-center gap-1.5 shadow-lg shadow-pink-600/20"
                  >
                    Pay with bKash
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#1e293b] p-12 rounded-2xl border border-slate-800 text-center text-slate-500">
            No fee structure published for this selection.
          </div>
        )}
      </div>

      {/* --- Modal: bKash Payment Form --- */}
      {selectedFee && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">bKash Payment</h3>
            <p className="text-slate-400 text-xs mb-4">Complete payment for <span className="text-indigo-400 font-semibold">{selectedFee.title}</span></p>

            {/* Merchant Info Notice */}
            <div className="bg-pink-950/40 border border-pink-500/30 p-3.5 rounded-xl mb-4 text-xs text-pink-200 space-y-1">
              <p className="font-semibold text-pink-400">Merchant Number: 01700000000</p>
              <p>Send Money / Merchant Pay <strong>৳{selectedFee.amount}</strong> to the number above and enter your TrxID below.</p>
            </div>

            {message.text && (
              <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tanzid Hasan"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Class Roll</label>
                <input
                  type="text"
                  placeholder="e.g. 102"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">bKash TrxID</label>
                <input
                  type="text"
                  placeholder="e.g. BKX89N2K10"
                  value={trxID}
                  onChange={(e) => setTrxID(e.target.value)}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-pink-400 placeholder-slate-500 focus:outline-none focus:border-pink-500 uppercase"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-white font-medium py-2.5 rounded-xl transition shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Payment'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFee(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}