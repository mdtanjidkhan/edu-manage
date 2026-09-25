
'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Send, User, BookOpen, Hash, Layers, Clock } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function StudentPayPage() {
  // Student Profile Info from Backend
  const [studentInfo, setStudentInfo] = useState(null);
  
  // Dynamic Fees Data & Loading States
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal / Payment Form State
  const [selectedFee, setSelectedFee] = useState(null);
  const [trxID, setTrxID] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchStudentFees();
  }, []);

  const fetchStudentFees = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/student/fees`, {
        headers: {
          authorization: `Bearer ${tokenData?.token}`
        }
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStudentInfo(data.studentInfo);
        setFees(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to load assigned fees.');
      }
    } catch (error) {
      console.error("Fetch Student Fees Error:", error);
      setErrorMsg('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;

    // TrxID Validation (Exactly 10 Characters Required)
    const cleanedTrxID = trxID.trim();
    if (cleanedTrxID.length !== 10) {
      setMessage({ type: 'error', text: 'bKash TrxID must be exactly 10 characters long.' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const paymentPayload = {
      feeId: selectedFee._id, // feeId পাঠানো নিরাপদ
      feeTitle: selectedFee.title,
      amount: selectedFee.amount,
      trxID: cleanedTrxID
    };

    try {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/student/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify(paymentPayload)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setMessage({ type: 'success', text: 'Payment submitted successfully!' });
        setTrxID('');
        // রিলোড ফি লিস্ট যাতে সাথে সাথে Paid/Pending আপডেট স্ট্যাটাস দেখায়
        fetchStudentFees();
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#0f172a] text-slate-400">
        <span className="loading loading-spinner loading-lg text-pink-500"></span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-[#0f172a] text-slate-100 min-h-screen space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <span className="p-2 bg-pink-600/20 text-pink-400 rounded-lg border border-pink-500/30">
            <CreditCard className="w-6 h-6" />
          </span>
          Student Fee Portal & bKash Payment
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Pay your academic fees directly through bKash verified by your student profile.
        </p>
      </div>

      {/* --- Student Academic Identity Card --- */}
      {studentInfo && (
        <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            Your Academic Profile
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-[#0f172a] rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 flex items-center gap-1"><User className="w-3.5 h-3.5"/> Name</span>
              <p className="font-semibold text-white mt-0.5 truncate">{studentInfo.name}</p>
            </div>
            <div className="p-3 bg-[#0f172a] rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 flex items-center gap-1"><BookOpen className="w-3.5 h-3.5"/> Class</span>
              <p className="font-semibold text-white mt-0.5">{studentInfo.class}</p>
            </div>
            <div className="p-3 bg-[#0f172a] rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 flex items-center gap-1"><Layers className="w-3.5 h-3.5"/> Group</span>
              <p className="font-semibold text-white mt-0.5">{studentInfo.group}</p>
            </div>
            <div className="p-3 bg-[#0f172a] rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 flex items-center gap-1"><Hash className="w-3.5 h-3.5"/> Student ID</span>
              <p className="font-semibold text-white mt-0.5">{studentInfo.studentId}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message if Profile incomplete or fetch fails */}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* --- Assigned Fees List --- */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Assigned Fees for You
        </h2>

        {fees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fees.map((fee) => {
              const status = fee.status ? fee.status.toLowerCase() : 'unpaid';
              const isPaid = status === 'paid' || status === 'completed';
              const isPending = status === 'pending';

              return (
                <div key={fee._id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-md text-xs font-medium">
                        {fee.category}
                      </span>
                      <span className="text-xs text-slate-400">Due: {fee.dueDate || 'N/A'}</span>
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

                    {isPaid ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Paid
                      </span>
                    ) : isPending ? (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Pending Approval
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedFee(fee);
                          setMessage({ type: '', text: '' });
                        }}
                        className="bg-pink-600 hover:bg-pink-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition flex items-center gap-1.5 shadow-lg shadow-pink-600/20"
                      >
                        Pay with bKash
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !errorMsg && (
            <div className="bg-[#1e293b] p-12 rounded-2xl border border-slate-800 text-center text-slate-500">
              No pending fees published for your class and group.
            </div>
          )
        )}
      </div>

      {/* --- Modal: bKash Payment Form --- */}
      {selectedFee && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e293b] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">bKash Payment</h3>
            <p className="text-slate-400 text-xs mb-4">
              Complete payment for <span className="text-indigo-400 font-semibold">{selectedFee.title}</span>
            </p>

            {/* Merchant Info Notice */}
            <div className="bg-pink-950/40 border border-pink-500/30 p-3.5 rounded-xl mb-4 text-xs text-pink-200 space-y-1">
              <p className="font-semibold text-pink-400">Merchant Number: 01700000000</p>
              <p>
                Send Money / Merchant Pay <strong>৳{selectedFee.amount}</strong> to the number above and enter your 10-character bKash TrxID below.
              </p>
            </div>

            {message.text && (
              <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {message.text}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              
              {/* Verified Student Details Display (Read-Only) */}
              <div className="grid grid-cols-2 gap-3 bg-[#0f172a] p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block">Student Name</span>
                  <span className="font-semibold text-white">{studentInfo?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Class & Group</span>
                  <span className="font-semibold text-white">{studentInfo?.class} ({studentInfo?.group})</span>
                </div>
              </div>

              {/* bKash TrxID Input */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">bKash TrxID (10 Characters)</label>
                <input
                  type="text"
                  placeholder="e.g. BKX89N2K10"
                  value={trxID}
                  onChange={(e) => setTrxID(e.target.value.toUpperCase())}
                  minLength={10}
                  maxLength={10}
                  required
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-pink-400 placeholder-slate-500 focus:outline-none focus:border-pink-500 uppercase"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-pink-600 hover:bg-pink-500 active:bg-pink-700 text-white font-medium py-2.5 rounded-xl transition shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
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