"use client";
import { useEffect, useState } from "react";
import { 
  FiDollarSign, 
  FiCheckCircle, 
  FiClock, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiUserCheck 
} from "react-icons/fi";

export default function AdminFeesPage() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFee, setSelectedFee] = useState(null);

  // Fetch Fee Records
  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/fees?department=${selectedDept}&status=${selectedStatus}&search=${searchTerm}`
      );
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
      }
    } catch (err) {
      console.error("Fee fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [selectedDept, selectedStatus, searchTerm]);

  // Handle Mark as Paid
  const handlePayment = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/fees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Paid", paymentMethod: "Cash" }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedFee(null);
        fetchFees();
      }
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  // Calculations for Stat Cards
  const totalCollected = records
    .filter((r) => r.status === "Paid")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const totalPending = records
    .filter((r) => r.status === "Pending")
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2.5">
          <FiDollarSign className="text-primary" /> Fees & Accounts Management
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1">
          Track student fee collections, pending balances, and overall account ledgers.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-base-content/60 font-medium">Total Collected</p>
            <p className="text-xl sm:text-2xl font-bold text-success">৳ {totalCollected}</p>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-error/10 text-error rounded-xl">
            <FiClock size={24} />
          </div>
          <div>
            <p className="text-xs text-base-content/60 font-medium">Pending Dues</p>
            <p className="text-xl sm:text-2xl font-bold text-error">৳ {totalPending}</p>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <FiUserCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-base-content/60 font-medium">Total Records</p>
            <p className="text-xl sm:text-2xl font-bold text-base-content">{records.length} Transactions</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Department Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
            >
              <option value="All">All Departments</option>
              <option value="Electrical Technology">Electrical Tech</option>
              <option value="Computer Technology">Computer Tech</option>
              <option value="Civil Technology">Civil Tech</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Search by student or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <span className="loading loading-spinner text-primary"></span>
            <p className="text-sm text-base-content/60">Fetching financial logs...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center p-12 text-base-content/60 space-y-2">
            <FiClock size={32} className="mx-auto text-base-content/30" />
            <p className="font-semibold text-sm">No fee records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70 text-xs font-semibold uppercase">
                <tr>
                  <th>Student Info</th>
                  <th>Fee Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-sm">
                {records.map((item) => (
                  <tr key={item._id} className="hover:bg-base-200/30 transition-colors">
                    <td>
                      <div className="font-bold text-base-content">{item.studentName}</div>
                      <div className="text-xs text-base-content/60">ID: {item.studentId} | {item.department}</div>
                    </td>
                    <td className="font-medium text-base-content/80">{item.feeType}</td>
                    <td className="font-bold text-base-content">৳ {item.amount}</td>
                    <td>
                      <span className={`badge badge-sm font-bold ${
                        item.status === "Paid" ? "badge-success" : "badge-error"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === "Pending" ? (
                        <button
                          onClick={() => handlePayment(item._id)}
                          className="btn btn-xs btn-primary rounded-lg"
                        >
                          Collect Payment
                        </button>
                      ) : (
                        <span className="text-xs text-success font-semibold">Paid on {item.paidAt || "N/A"}</span>
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