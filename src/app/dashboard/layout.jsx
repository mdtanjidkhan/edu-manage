
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


