
// "use client";
// import { authClient } from "@/lib/auth-client";
// import { useRouter, usePathname } from "next/navigation";
// import Link from "next/link";
// import { 
//   FiHome, FiUsers, FiCalendar, FiDollarSign, 
//   FiSettings, FiLogOut, FiBell, FiUser, FiBookOpen, 
//   FiAward, FiCheckSquare, FiClock, FiFileText, FiShield,
// } from "react-icons/fi";
// import { MdAssignmentAdd } from "react-icons/md";

// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const pathname = usePathname(); 
  
//   // ১. Better Auth 
//   const { data: session, isPending } = authClient.useSession();
//   const user = session?.user;
//   const userRole = user?.role || "student"; 

//   // ২. Logout 
//   const handleLogout = async () => {
//     await authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           router.push("/login");
//         },
//       },
//     });
//   };

//   const closeDrawer = () => {
//     const drawerCheckbox = document.getElementById("dashboard-drawer");
//     if (drawerCheckbox) {
//       drawerCheckbox.checked = false;
//     }
//   };

//   // Admin Menu
//   const adminMenuItems = [
//     { name: "Dashboard", href: "/dashboard/admin", icon: FiHome },
//     { name: "Users & Roles", href: "/dashboard/admin/users", icon: FiShield },
//     { name: "Students", href: "/dashboard/admin/students", icon: FiUsers },
//     { name: "Teachers", href: "/dashboard/admin/teachers", icon: FiUsers },
//     { name: "Routine", href: "/dashboard/admin/routine", icon: FiClock },
//     { name: "Attendance", href: "/dashboard/admin/attendance", icon: FiCalendar },
//     { name: "Fees & Accounts", href: "/dashboard/admin/fees", icon: FiDollarSign },
//     { name: "Notice Board", href: "/dashboard/admin/notices", icon: FiBell },
//     { name: "Settings", href: "/dashboard/admin/settings", icon: FiSettings },
//   ];

//   // Teacher Menu
//   const teacherMenuItems = [
//     { name: "Dashboard", href: "/dashboard/teacher", icon: FiHome },
//     { name: "My Attendance", href: "/dashboard/teacher/my-attendance", icon: FiCalendar },
//     { name: "Take Attendance", href: "/dashboard/teacher/attendance", icon: FiCheckSquare },
//     { name: "Input Marks", href: "/dashboard/teacher/marks", icon: FiFileText },
//     { name: "My Class Routine", href: "/dashboard/teacher/routine", icon: FiClock },
//     { name: "My Students", href: "/dashboard/teacher/students", icon: FiUsers },
//     { name: "Assignments", href: "/dashboard/teacher/assignments", icon: MdAssignmentAdd },
//   ];

//   // Student Menu
//   const studentMenuItems = [
//     { name: "My Dashboard", href: "/dashboard/student", icon: FiHome },
//     { name: "Class Routine", href: "/dashboard/student/routine", icon: FiBookOpen },
//     { name: "My Attendance", href: "/dashboard/student/attendance", icon: FiCalendar },
//     { name: "Assignments", href: "/dashboard/student/assignments", icon: MdAssignmentAdd },
//     { name: "Exam Results", href: "/dashboard/student/results", icon: FiAward },
//     { name: "Pay Fees", href: "/dashboard/student/fees", icon: FiDollarSign },
//   ];

//   // role menu
//   const getMenuItems = () => {
//     if (userRole === "admin") return adminMenuItems;
//     if (userRole === "teacher") return teacherMenuItems;
//     return studentMenuItems;
//   };

//   const currentMenu = getMenuItems();

//   //
//   if (isPending) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-base-200">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="drawer lg:drawer-open min-h-screen bg-base-200">
//       <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
//       {/* --- MAIN CONTENT AREA --- */}
//       <div className="drawer-content flex flex-col min-w-0">
//         {/* Top Header/Navbar */}
//         <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 px-4 sm:px-8 shadow-xs">
//           <div className="flex-1 gap-2">
//             <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost lg:hidden drawer-button">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//               </svg>
//             </label>
//             <div>
//               <h1 className="text-lg sm:text-xl font-bold text-base-content capitalize tracking-wide">
//                 {userRole} Portal
//               </h1>
//             </div>
//           </div>

//           {/* Right Profile Header */}
//           <div className="flex-none gap-3 sm:gap-4">
//             {/* Notification Button */}
//             <button className="btn btn-ghost btn-circle">
//               <div className="indicator">
//                 <FiBell size={20} />
//                 <span className="badge badge-xs badge-primary indicator-item"></span>
//               </div>
//             </button>

//             {/* Profile Dropdown */}
//             <div className="dropdown dropdown-end">
//               <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-300">
//                 {user?.image ? (
//                   <div className="w-10 rounded-full">
//                     <img src={user.image} alt={user.name} />
//                   </div>
//                 ) : (
//                   <div className="w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
//                     <FiUser size={20} />
//                   </div>
//                 )}
//               </div>
//               <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-2xl bg-base-100 rounded-box w-56 border border-base-200">
//                 <li className="menu-title px-4 py-2">
//                   <div className="font-bold text-base-content">{user?.name || "User"}</div>
//                   <div className="text-xs text-base-content/60 font-normal truncate">{user?.email}</div>
//                   <span className="badge badge-primary badge-xs mt-1.5 capitalize font-medium">{userRole}</span>
//                 </li>
//                 <div className="divider my-0"></div>
//                 <li><Link href="/profile">My Profile</Link></li>
//                 <li className="text-error">
//                   <button onClick={handleLogout}>Logout</button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
//           {children}
//         </main>
//       </div>

//       {/* --- SIDEBAR AREA (Mobile Drawer + Desktop Sticky Sidebar) --- */}
//       <div className="drawer-side z-40">
//         <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
//         <aside className="bg-base-100 border-r border-base-300 w-64 lg:w-72 min-h-full lg:h-screen lg:sticky lg:top-0 flex flex-col justify-between select-none">
//           <div>
//             {/* Sidebar Logo */}
//             <div className="h-16 flex items-center px-6 border-b border-base-300 bg-base-100">
//               <Link href="/" className="text-2xl font-black text-primary tracking-tight">
//                 Edu<span className="text-base-content">Manage</span>
//               </Link>
//             </div>

//             {/* Dynamic Role-Based Menu */}
//             <nav className="p-4 w-full">
//               <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider px-3 mb-2">
//                 Main Menu
//               </p>
//               <ul className="flex flex-col gap-1.5">
//                 {currentMenu.map((item) => {
//                   const Icon = item.icon;
//                   //
//                   const isActive = pathname === item.href;

//                   return (
//                     <li key={item.name}>
//                       <Link 
//                         href={item.href} 
//                         onClick={closeDrawer} 
//                         className={`group flex items-center gap-3.5 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
//                           isActive 
//                             ? "bg-primary text-primary-content font-semibold shadow-md shadow-primary/25" 
//                             : "hover:bg-base-200 text-base-content/80 hover:text-base-content"
//                         }`}
//                       >
//                         <Icon 
//                           size={20} 
//                           className={`transition-transform duration-200 group-hover:scale-110 ${
//                             isActive ? "text-primary-content" : "text-primary"
//                           }`} 
//                         />
//                         <span>{item.name}</span>
//                       </Link>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </nav>
//           </div>

//           {/* Logout Button Footer */}
//           <div className="p-4 border-t border-base-300 bg-base-100">
//             <button 
//               onClick={handleLogout} 
//               className="btn btn-error btn-outline w-full flex items-center justify-center gap-2 font-semibold hover:text-white"
//             >
//               <FiLogOut size={18} />
//               <span>Logout</span>
//             </button>
//           </div>
//         </aside>
//       </div>
//     </div>
//   );
// }


import React from "react";
// import { Toaster } from "react-hot-toast";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";

const DashboardLayout = async ({ children }) => {
  // ১. Server Side Session Validation
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }
  return (
    <DashboardSidebar>
      {children}
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
    </DashboardSidebar>
  );
};

export default DashboardLayout;


