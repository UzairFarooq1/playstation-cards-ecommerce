import { User } from "next-auth";

export async function checkUserRole(
  user: User,
  requiredRoles: string[]
): Promise<boolean> {
  // Fetch the user's roles from your database or authentication service
  const userRoles = await fetchUserRoles(user.id);

  // Check if the user has any of the required roles
  return requiredRoles.some((role) => userRoles.includes(role));
}

async function fetchUserRoles(userId: string): Promise<string[]> {
  // Implement this function to fetch user roles from your database
  // For example:
  // const user = await prisma.user.findUnique({ where: { id: userId }, include: { roles: true } })
  // return user.roles.map(role => role.name)

  // Placeholder implementation
  return ["USER"]; // Replace with actual implementation
}
