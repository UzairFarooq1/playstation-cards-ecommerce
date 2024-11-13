import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import AdminDashboard from "../components/AdminDashboard";

const prisma = new PrismaClient();

export default async function AdminPage() {
  // Fetch the currently logged-in user from the database
  const currentUser = await prisma.user.findUnique({
    where: {
      email: "uzairf2580@gmail.com",
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log(
    "AdminPage - Current user:",
    JSON.stringify(currentUser, null, 2)
  );

  // Check if the user has the "ADMIN" role
  if (!currentUser || currentUser.role !== "ADMIN") {
    console.log(
      `AdminPage - Access denied. User email: ${currentUser?.email}, role: ${currentUser?.role}`
    );
    redirect("/unauthorized");
  }

  console.log("AdminPage - Access granted, rendering AdminDashboard");
  return <AdminDashboard />;
}
