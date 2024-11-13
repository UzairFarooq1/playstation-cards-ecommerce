// app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import AdminDashboard from "../components/AdminDashboard";
import { redirect } from "next/navigation";
import { checkUserRole } from "../lib/auth-utils";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    // Redirect unauthenticated users to the login page
    return redirect("/login");
  }

  if (!(await checkUserRole(session.user, ["ADMIN"]))) {
    // Redirect non-admin users to an unauthorized page
    return redirect("/unauthorized");
  }

  // Render the AdminDashboard component
  return <AdminDashboard />;
}
