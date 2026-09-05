"use client";
import { useEffect, useState } from "react";
import { 
  FiSettings, 
  FiGlobe, 
  FiSliders, 
  FiShield, 
  FiSave, 
  FiCheckCircle,
  FiUsers,
  FiUserX,
  FiPieChart
} from "react-icons/fi";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    blockedUsers: 0
  });

  const [settings, setSettings] = useState({
    instituteName: "",
    academicYear: "",
    allowSelfSignup: true,
    maintenanceMode: false
  });

  // Fetch Current Settings and Analytics
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.settings);
          setStats(data.stats);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Save Settings Handler
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();

      if (data.success) {
        setToastMsg("System settings saved successfully!");
        setTimeout(() => setToastMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success text-white shadow-lg rounded-xl flex items-center gap-2">
            <FiCheckCircle size={18} />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2.5">
          <FiSettings className="text-primary" /> System Settings & Controls
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1">
          Configure general institution parameters, access control toggles, and system security.
        </p>
      </div>

      {/* Quick System Summary */}
      <div>
        <h2 className="text-base font-bold text-base-content mb-3 flex items-center gap-2">
          <FiPieChart className="text-primary" /> System Overview
        </h2>
        {loading ? (
          <div className="flex justify-center p-8 bg-base-100 rounded-2xl border border-base-300">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <FiUsers size={22} />
              </div>
              <div>
                <p className="text-xs text-base-content/60 font-medium">Total Registered</p>
                <p className="text-xl font-bold text-base-content">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                <FiUsers size={22} />
              </div>
              <div>
                <p className="text-xs text-base-content/60 font-medium">Students</p>
                <p className="text-xl font-bold text-base-content">{stats.totalStudents}</p>
              </div>
            </div>

            <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-accent/10 text-accent rounded-xl">
                <FiUsers size={22} />
              </div>
              <div>
                <p className="text-xs text-base-content/60 font-medium">Teachers</p>
                <p className="text-xl font-bold text-base-content">{stats.totalTeachers}</p>
              </div>
            </div>

            <div className="bg-base-100 border border-base-300 p-4 rounded-2xl flex items-center gap-4 shadow-xs">
              <div className="p-3 bg-error/10 text-error rounded-xl">
                <FiUserX size={22} />
              </div>
              <div>
                <p className="text-xs text-base-content/60 font-medium">Blocked Accounts</p>
                <p className="text-xl font-bold text-error">{stats.blockedUsers}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* General Information Card */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-base-200 pb-3">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <FiGlobe className="text-primary" /> General Information
            </h3>
            <p className="text-xs text-base-content/60">Institutional parameters displayed across system invoices and header titles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-base-content/70 mb-1 block">Institute Name</label>
              <input
                type="text"
                value={settings.instituteName}
                onChange={(e) => setSettings({ ...settings, instituteName: e.target.value })}
                className="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-base-content/70 mb-1 block">Academic Year</label>
              <input
                type="text"
                value={settings.academicYear}
                onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                className="input input-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>
          </div>
        </div>

        {/* Security & Access Controls Card */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-base-200 pb-3">
            <h3 className="text-base font-bold text-base-content flex items-center gap-2">
              <FiSliders className="text-primary" /> Access Control & Security
            </h3>
            <p className="text-xs text-base-content/60">Configure public user registration and emergency system access rules.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-base-200/40 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-base-content">Allow Student Self-Registration</p>
                <p className="text-xs text-base-content/60">Permit new students to register accounts from the landing page.</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.allowSelfSignup}
                onChange={(e) => setSettings({ ...settings, allowSelfSignup: e.target.checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-error/5 border border-error/10 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-error">System Maintenance Mode</p>
                <p className="text-xs text-base-content/60">Temporarily restrict student and teacher logins during site updates.</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-error"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary rounded-xl px-6 gap-2 w-full sm:w-auto"
          >
            {saving ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <FiSave size={18} /> Save Configurations
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}