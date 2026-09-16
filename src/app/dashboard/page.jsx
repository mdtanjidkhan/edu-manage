import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
//   role of the user from the session
  const role = session.user?.role; 
  switch (role) {
    case "admin":
      redirect("/dashboard/admin");
    case "teacher":
      redirect("/dashboard/teacher");
    case "student":
      redirect("/dashboard/student");
    default:
      redirect("/unauthorized");
  }
}