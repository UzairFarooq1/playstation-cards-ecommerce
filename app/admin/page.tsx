import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import AdminDashboard from "../components/AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  console.log("AdminPage - Session:", JSON.stringify(session, null, 2));

  if (!session || !session.user) {
    console.log("AdminPage - No session, redirecting to login");
    redirect("/login");
  }

  if (
    session.user.email !== "uzairf2580@gmail.com" ||
    session.user.role !== "ADMIN"
  ) {
    console.log(
      `AdminPage - Access denied. User email: ${session.user.email}, role: ${session.user.role}`
    );
    redirect("/unauthorized");
  }

  console.log("AdminPage - Access granted, rendering AdminDashboard");
  return <AdminDashboard />;
}
