"use client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { 
  FiShield, 
  FiSearch, 
  FiUser, 
  FiCheckCircle, 
  FiSlash, 
  FiEdit3,
  FiX
} from "react-icons/fi";

export default function UserRoleManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("student");
  const [newStatus, setNewStatus] = useState("active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || "student");
    setNewStatus(user.status || "active");
  };

  const handleUpdateAccess = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);

    try {
      const { data: tokenData} = await authClient.token();
      console.log("Token Data:", tokenData);
      const res = await fetch(`http://localhost:5000/api/admin/users/${selectedUser._id}/access`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", 
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify({ role: newRole, status: newStatus })
      });
      const data = await res.json();

      if (data.success) {
        setSelectedUser(null);
        fetchUsers();
      } else {
        alert(data.message || "Failed to update access.");
      }
    } catch (err) {
      alert("Server error while updating user status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "All" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2">
          <FiShield className="text-primary" /> Role & Status Management
        </h1>
        <p className="text-sm text-base-content/60 mt-1">
          Control system access, assign roles, and activate or block registered accounts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
          <input
            type="text"
            placeholder="Search user by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 rounded-xl text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-base-content/60 uppercase whitespace-nowrap">
            Role Filter:
          </span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="select select-bordered w-full md:w-48 rounded-xl text-sm focus:outline-none focus:border-primary"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3">
            <span className="loading loading-spinner loading-md text-primary"></span>
            <p className="text-sm text-base-content/60">Fetching user accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12 text-base-content/60">
            No users found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200/50 text-base-content/70 text-xs font-semibold uppercase">
                <tr>
                  <th>User Details</th>
                  <th>Current Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th className="text-right">Manage Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200/30 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/10 text-primary font-bold rounded-full w-10 h-10 flex items-center justify-center">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-base-content">{user.name}</div>
                          <div className="text-xs text-base-content/60">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-sm font-semibold capitalize ${
                        user.role === "admin" 
                          ? "badge-primary" 
                          : user.role === "teacher" 
                          ? "badge-secondary" 
                          : "badge-ghost"
                      }`}>
                        {user.role || "student"}
                      </span>
                    </td>
                    <td>
                      {user.status === "blocked" ? (
                        <span className="badge badge-error badge-outline badge-sm gap-1 font-semibold">
                          <FiSlash size={12} /> Blocked
                        </span>
                      ) : (
                        <span className="badge badge-success badge-outline badge-sm gap-1 font-semibold">
                          <FiCheckCircle size={12} /> Active
                        </span>
                      )}
                    </td>
                    <td className="text-xs text-base-content/60">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="btn btn-ghost btn-xs text-primary font-semibold gap-1"
                      >
                        <FiEdit3 size={15} /> Edit Role / Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- EDIT ACCESS MODAL --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-base-100 rounded-2xl border border-base-300 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-base-200">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <FiShield className="text-primary" /> Update Access Control
              </h3>
              <button onClick={() => setSelectedUser(null)} className="btn btn-sm btn-circle btn-ghost">
                <FiX size={18} />
              </button>
            </div>

            <div className="bg-base-200/50 p-3 rounded-xl flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary/20 text-primary font-bold rounded-full w-9 h-9 flex items-center justify-center">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-base-content">{selectedUser.name}</p>
                <p className="text-xs text-base-content/60">{selectedUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateAccess} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">Assign Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70 mb-1 block">Account Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="select select-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
                >
                  <option value="active">Active (Access Allowed)</option>
                  <option value="blocked">Blocked (Access Restricted)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-base-200">
                <button type="button" onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-sm rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-sm rounded-xl">
                  {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : "Save Access Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}