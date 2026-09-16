"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  FiUser, FiUpload, FiCheck, FiMail, FiShield, FiHash, FiBriefcase, FiBookOpen 
} from "react-icons/fi";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const userRole = user?.role || "student";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage({ type: "", text: "" });
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });

      const imgbbData = await imgbbRes.json();

      if (!imgbbData.success) {
        throw new Error(imgbbData.error?.message || "ImgBB upload failed");
      }

      const imageUrl = imgbbData.data.display_url;

      // Better Auth Profile এ Image Update
      await authClient.updateUser({
        image: imageUrl,
      });

      await refetch();

      setMessage({ type: "success", text: "Profile picture updated successfully!" });
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to update profile picture." });
    } finally {
      setUploading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-error font-medium">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-xl overflow-hidden">
        
        {/* Banner with Gradient color based on Role */}
        <div className={`h-32 bg-gradient-to-r ${
          userRole === "admin" 
            ? "from-error to-warning" 
            : userRole === "teacher" 
            ? "from-secondary to-accent" 
            : "from-primary to-secondary"
        } p-6`}></div>

        <div className="px-6 pb-8 pt-0 relative">
          
          {/* Avatar and ImgBB Upload Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-6 gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full ring-4 ring-base-100 bg-base-200 overflow-hidden shadow-md flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.image ? (
                  <img src={user.image} alt={user?.name || "User"} className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-16 h-16 text-base-content/40" />
                )}
              </div>
            </div>

            <form onSubmit={handleImageUpload} className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <label className="btn btn-outline btn-sm gap-2 w-full sm:w-auto cursor-pointer">
                <FiUpload size={16} />
                <span>{selectedFile ? "Change Photo" : "Upload Photo"}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {selectedFile && (
                <button type="submit" disabled={uploading} className="btn btn-primary btn-sm gap-2 w-full sm:w-auto">
                  {uploading ? <span className="loading loading-spinner loading-xs"></span> : <FiCheck size={16} />}
                  Save Image
                </button>
              )}
            </form>
          </div>

          {/* Status Message */}
          {message.text && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-6 text-sm py-2`}>
              <span>{message.text}</span>
            </div>
          )}

          {/* User Basic Info */}
          <div className="border-b border-base-200 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-base-content">{user?.name || "User Name"}</h1>
              <span className={`badge ${
                userRole === "admin" ? "badge-error" : userRole === "teacher" ? "badge-secondary" : "badge-primary"
              } capitalize font-semibold`}>
                {userRole}
              </span>
            </div>
            <p className="text-base-content/60 text-sm flex items-center gap-1.5 mt-1">
              <FiMail size={16} /> {user?.email}
            </p>
          </div>

          {/* Dynamic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Account Role Card */}
            <div className="p-4 rounded-xl border border-base-200 bg-base-200/40 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <FiShield size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Account Permission</p>
                <p className="text-lg font-bold text-base-content capitalize">{userRole} Access</p>
              </div>
            </div>

            {/* 2. Dynamic Info Card (Role অনুযায়ী চেঞ্জ হবে) */}
            {userRole === "student" && (
              <div className="p-4 rounded-xl border border-base-200 bg-base-200/40 flex items-center gap-4">
                <div className="p-3 bg-secondary/10 text-secondary rounded-lg">
                  <FiHash size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Student Roll</p>
                  <p className="text-lg font-bold text-base-content">{user?.roll || "N/A"}</p>
                </div>
              </div>
            )}

            {userRole === "teacher" && (
              <div className="p-4 rounded-xl border border-base-200 bg-base-200/40 flex items-center gap-4">
                <div className="p-3 bg-accent/10 text-accent rounded-lg">
                  <FiBookOpen size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Department / Subject</p>
                  <p className="text-lg font-bold text-base-content">{user?.department || "Teacher"}</p>
                </div>
              </div>
            )}

            {userRole === "admin" && (
              <div className="p-4 rounded-xl border border-base-200 bg-base-200/40 flex items-center gap-4">
                <div className="p-3 bg-error/10 text-error rounded-lg">
                  <FiBriefcase size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">System Management</p>
                  <p className="text-lg font-bold text-base-content">Full Admin Control</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}