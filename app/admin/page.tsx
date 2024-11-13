import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";
import AdminDashboard from "../components/AdminDashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  console.log("AdminPage - Session:", JSON.stringify(session, null, 2));

  if (!session) {
    console.log("AdminPage - No session, redirecting to login");
    redirect("/login");
  } else if (session.user.email !== "uzairf2580@gmail.com") {
    console.log(
      `AdminPage - User role is ${session.user.role}, redirecting to unauthorized`
    );
    redirect("/unauthorized");
  }

  console.log("AdminPage - Rendering AdminDashboard");
  return <AdminDashboard />;
}
