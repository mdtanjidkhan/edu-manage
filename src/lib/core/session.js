import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const requireRole = async (allowedRole) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (!session || !session.user) {
    return redirect("/login");
  }

  if (session.user.role !== allowedRole) {
    return redirect("/unauthorized");
  }
};