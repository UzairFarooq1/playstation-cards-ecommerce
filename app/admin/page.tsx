import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AdminPanel from "../components/AdminPanel";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Log the session for debugging purposes
  console.log("Session:", session);

  if (!session) {
    // Redirect to login if no session is found
    redirect("/");
  } else if (session.user.role !== "ADMIN") {
    // Optional: check if the user has admin privileges, if applicable
    redirect("/unauthorized");
  }

  return <AdminPanel />;
}
