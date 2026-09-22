
"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  FiUser, FiUpload, FiCheck, FiMail, FiShield, FiHash, FiBriefcase, 
  FiBookOpen, FiPhone, FiLock, FiLayers 
} from "react-icons/fi";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  
  // Custom State for freshly fetched user data
  const [fullUserData, setFullUserData] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [studentClass, setStudentClass] = useState("");
  const [studentGroup, setStudentGroup] = useState("General");
  const [studentPhone, setStudentPhone] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);

  const user = fullUserData || session?.user;

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const userRole = user?.role || "student";
  const isStudentProfileLocked = Boolean(user?.class || user?.phone);

  // Database/Server 
  useEffect(() => {
    const fetchFreshUserData = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/profile/me`, {
          headers: {
            authorization: `Bearer ${tokenData?.token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setFullUserData(data.user);
        }
      } catch (err) {
        console.error("Error fetching fresh user data:", err);
      }
    };

    if (session?.user) {
      fetchFreshUserData();
    }
  }, [session]);

  // user তথ্য পরিবর্তন হলে Local Form State Sync করা
  useEffect(() => {
    if (user) {
      setStudentClass(user.class || "");
      setStudentGroup(user.group || "General");
      setStudentPhone(user.phone || "");
    }
  }, [user]);

  const handleClassChange = (e) => {
    const selected = e.target.value;
    setStudentClass(selected);

    if (["Class 6", "Class 7", "Class 8"].includes(selected)) {
      setStudentGroup("General");
    } else if (["Class 9", "Class 10"].includes(selected)) {
      setStudentGroup("Science");
    }
  };

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

      await authClient.updateUser({ image: imageUrl });
      await refetch();

      setMessage({ type: "success", text: "Profile picture updated successfully!" });
      setSelectedFile(null);
      setPreview(null);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update profile picture." });
    } finally {
      setUploading(false);
    }
  };

  const handleStudentInfoSubmit = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    setMessage({ type: "", text: "" });

    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_SITE_URL}/api/profile/update-student`, {
        method: "PUT", 
        headers: { 
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify({
          studentClass,
          studentGroup,
          studentPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update information.");
      }
      await refetch();
      setMessage({ type: "success", text: "Information saved & locked successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSavingInfo(false);
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
        
        {/* Banner */}
        <div className={`h-32 bg-gradient-to-r ${
          userRole === "admin" 
            ? "from-error to-warning" 
            : userRole === "teacher" 
            ? "from-secondary to-accent" 
            : "from-primary to-secondary"
        } p-6`}></div>

        <div className="px-6 pb-8 pt-0 relative">
          
          {/* Avatar Upload */}
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

          {/* Alert Message */}
          {message.text && (
            <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} mb-6 text-sm py-2`}>
              <span>{message.text}</span>
            </div>
          )}

          {/* User Info */}
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

          {/* General Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-base-200 bg-base-200/40 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <FiShield size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Account Permission</p>
                <p className="text-lg font-bold text-base-content capitalize">{userRole} Access</p>
              </div>
            </div>

            {userRole === "student" && (
              <div className="p-4 rounded-xl border border-base-200 bg-base-200/40 flex items-center gap-4">
                <div className="p-3 bg-secondary/10 text-secondary rounded-lg">
                  <FiHash size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Student ID / Roll</p>
                  <p className="text-lg font-bold text-base-content">
                    ID: {user?.studentId || "N/A"} | Roll: {user?.roll || "N/A"}
                  </p>
                </div>
              </div>
            )}

            {userRole === "teacher" && (
              <div className="p-4 rounded-xl border border-base-200 bg-base-200/40 flex items-center gap-4">
                <div className="p-3 bg-accent/10 text-accent rounded-lg">
                  <FiBookOpen size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Department</p>
                  <p className="text-lg font-bold text-base-content">{user?.designation || "Teacher"}</p>
                </div>
              </div>
            )}

            {userRole === "admin" && (
              <div className="p-4 rounded-xl border border-base-200 bg-base-200/40 flex items-center gap-4">
                <div className="p-3 bg-error/10 text-error rounded-lg">
                  <FiBriefcase size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">System Control</p>
                  <p className="text-lg font-bold text-base-content">Full Admin Access</p>
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Section */}
          {userRole === "student" && (
            <div className="mt-6 pt-6 border-t border-base-200">
              <h2 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                Student Academic Info 
                {isStudentProfileLocked && (
                  <span className="badge badge-sm badge-success badge-outline gap-1 text-xs">
                    <FiLock size={12}/> Locked & Verified
                  </span>
                )}
              </h2>

              {isStudentProfileLocked ? (
                /* READ-ONLY LOCKED DISPLAY */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-base-200 bg-base-200/30">
                    <p className="text-xs font-semibold text-base-content/60 uppercase flex items-center gap-1.5">
                      <FiBookOpen size={14}/> Class
                    </p>
                    <p className="text-base font-bold text-base-content mt-1">{user?.class || "N/A"}</p>
                  </div>

                  <div className="p-4 rounded-xl border border-base-200 bg-base-200/30">
                    <p className="text-xs font-semibold text-base-content/60 uppercase flex items-center gap-1.5">
                      <FiLayers size={14}/> Group
                    </p>
                    <p className="text-base font-bold text-base-content mt-1">{user?.group || "General"}</p>
                  </div>

                  <div className="p-4 rounded-xl border border-base-200 bg-base-200/30">
                    <p className="text-xs font-semibold text-base-content/60 uppercase flex items-center gap-1.5">
                      <FiPhone size={14}/> Phone
                    </p>
                    <p className="text-base font-bold text-base-content mt-1">{user?.phone || "N/A"}</p>
                  </div>
                </div>
              ) : (
                /* EDITABLE FORM */
                <form onSubmit={handleStudentInfoSubmit} className="bg-base-200/30 p-5 rounded-2xl border border-base-200">
                  <p className="text-xs text-warning font-medium mb-4">
                    ⚠️ Please enter your details carefully. Once saved, these details cannot be changed without Admin permission.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Class Selection */}
                    <div className="form-control">
                      <label className="label text-xs font-semibold">Class</label>
                      <select 
                        className="select select-bordered select-sm w-full"
                        value={studentClass}
                        onChange={handleClassChange}
                        required
                      >
                        <option value="" disabled>Select Class</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                      </select>
                    </div>

                    {/* Group Selection */}
                    <div className="form-control">
                      <label className="label text-xs font-semibold">Group</label>
                      {["Class 9", "Class 10"].includes(studentClass) ? (
                        <select 
                          className="select select-bordered select-sm w-full"
                          value={studentGroup}
                          onChange={(e) => setStudentGroup(e.target.value)}
                          required
                        >
                          <option value="Science">Science</option>
                          <option value="Arts">Arts</option>
                          <option value="Commerce">Commerce</option>
                        </select>
                      ) : (
                        <input 
                          type="text" 
                          className="input input-bordered input-sm w-full bg-base-200 cursor-not-allowed"
                          value="General" 
                          disabled 
                        />
                      )}
                    </div>

                    {/* Phone Input */}
                    <div className="form-control">
                      <label className="label text-xs font-semibold">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="e.g. 01700000000"
                        className="input input-bordered input-sm w-full"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={savingInfo}
                      className="btn btn-primary btn-sm gap-2"
                    >
                      {savingInfo && <span className="loading loading-spinner loading-xs"></span>}
                      Save Academic Info
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}