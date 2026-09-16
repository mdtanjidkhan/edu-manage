"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  FiBell, FiUser, FiLogOut, FiLayout, FiMenu, FiX 
} from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Better Auth Session Tracking
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  // Logout Handler
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const closeDrawer = () => {
    const drawerCheckbox = document.getElementById("navbar-drawer");
    if (drawerCheckbox) drawerCheckbox.checked = false;
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Notice", href: "/notice" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="drawer">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* --- MAIN NAVBAR CONTENT --- */}
      <div className="drawer-content flex flex-col">
        <header className="sticky top-0 z-40 bg-base-100/90 backdrop-blur-md border-b border-base-300 shadow-sm transition-all">
          <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* --- NAVBAR START: Mobile Menu Button & Logo --- */}
            <div className="navbar-start gap-2">
              {/* Mobile Drawer Toggle Button */}
              <label
                htmlFor="navbar-drawer"
                className="btn btn-ghost btn-circle lg:hidden"
                aria-label="open sidebar"
              >
                <FiMenu className="w-6 h-6" />
              </label>

              {/* Site Logo */}
              <Link href="/" className="text-2xl font-black text-primary tracking-tight flex items-center gap-1">
                Edu<span className="text-base-content">Manage</span>
              </Link>
            </div>

            {/* --- NAVBAR CENTER: Desktop Links --- */}
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1 gap-1 text-sm font-medium">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`rounded-lg transition-all ${
                        pathname === link.href
                          ? "text-primary font-bold bg-primary/10"
                          : "hover:text-primary hover:bg-base-200 text-base-content/80"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}

                {/* Logged in হলে Dashboard লিঙ্ক দেখাবে */}
                {user && (
                  <li>
                    <Link
                      href="/dashboard"
                      className={`rounded-lg transition-all font-semibold ${
                        pathname.startsWith("/dashboard")
                          ? "bg-primary text-primary-content font-bold"
                          : " hover:bg-primary/10"
                      }`}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* --- NAVBAR END: Login/Logout & Profile Avatar --- */}
            <div className="navbar-end gap-2">
              {isPending ? (
                <span className="loading loading-spinner loading-sm text-primary"></span>
              ) : user ? (
                // --- LOGGED IN STATE ---
                <div className="flex items-center gap-2">
                  
                  {/* Notifications Button */}
                  <button className="btn btn-ghost btn-circle hidden sm:flex">
                    <div className="indicator">
                      <FiBell size={20} />
                      <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                  </button>

                  {/* User Avatar & Desktop Dropdown */}
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost btn-circle avatar border border-base-300 hover:border-primary transition"
                    >
                      {user?.image ? (
                        <div className="w-10 rounded-full">
                          <img src={user.image} alt={user.name || "User"} />
                        </div>
                      ) : (
                        <div className="w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          <FiUser size={20} />
                        </div>
                      )}
                    </div>

                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-2xl bg-base-100 rounded-box w-60 border border-base-200"
                    >
                      {/* User Info */}
                      <li className="menu-title px-4 py-2.5">
                        <div className="font-bold text-base-content text-sm">{user?.name || "User"}</div>
                      </li>

                      <div className="divider my-0"></div>

                      {/* Dropdown Links */}
                      <li>
                        <Link href="/profile" className="flex items-center gap-2 py-2">
                          <FiUser size={16} />
                          Profile
                        </Link>
                      </li>

                      <li>
                        <Link href="/dashboard" className="flex items-center gap-2 py-2 font-medium text-primary">
                          <FiLayout size={16} />
                          Dashboard
                        </Link>
                      </li>

                      <div className="divider my-0"></div>

                      {/* Logout Button */}
                      <li className="text-error font-medium">
                        <button onClick={handleLogout} className="flex items-center gap-2 py-2">
                          <FiLogOut size={16} />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>

                </div>
              ) : (
                // --- LOGGED OUT STATE ---
                <div className="flex items-center gap-2">
                  <Link href="/login" className="btn btn-ghost btn-sm font-semibold">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary btn-sm font-semibold shadow-md shadow-primary/20">
                    Register
                  </Link>
                </div>
              )}
            </div>

          </div>
        </header>
      </div>

      {/* --- MOBILE DRAWER SIDEBAR --- */}
      <div className="drawer-side z-50 lg:hidden">
        <label htmlFor="navbar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="menu p-4 w-72 min-h-full bg-base-100 text-base-content flex flex-col justify-between border-r border-base-200">
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-base-200 mb-4">
              <Link href="/" onClick={closeDrawer} className="text-xl font-black text-primary">
                Edu<span className="text-base-content">Manage</span>
              </Link>
              <label htmlFor="navbar-drawer" className="btn btn-ghost btn-circle btn-sm">
                <FiX size={20} />
              </label>
            </div>

            {/* Mobile Nav Links */}
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={closeDrawer}
                    className={`py-3 ${
                      pathname === link.href ? "active font-bold text-primary bg-primary/10" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {/* Logged in users get Dashboard link in Mobile Drawer */}
              {user && (
                <li className="pt-2">
                  <Link
                    href="/dashboard"
                    onClick={closeDrawer}
                    className="font-semibold hover:bg-primary hover:text-white transition py-3"
                  >
                    <FiLayout size={18} />
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Drawer Bottom Action (User Profile / Auth Buttons) */}
          <div className="border-t border-base-200 pt-4 mt-auto">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="avatar">
                    {user?.image ? (
                      <div className="w-10 rounded-full">
                        <img src={user.image} alt={user.name || "User"} />
                      </div>
                    ) : (
                      <div className="w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <FiUser size={20} />
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">{user?.name || "User"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  <Link
                    href="/profile"
                    onClick={closeDrawer}
                    className="btn btn-ghost btn-sm justify-start gap-2"
                  >
                    <FiUser size={16} /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      closeDrawer();
                      handleLogout();
                    }}
                    className="btn btn-error btn-outline btn-sm justify-start gap-2"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={closeDrawer}
                  className="btn btn-outline btn-sm w-full"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeDrawer}
                  className="btn btn-primary btn-sm w-full"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





