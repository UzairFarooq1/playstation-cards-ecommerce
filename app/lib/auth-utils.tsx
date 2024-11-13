import { User } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkUserRole(
  user: User,
  requiredRoles: string[]
): Promise<boolean> {
  const userWithRole = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!userWithRole || !userWithRole.role) {
    return false;
  }

  return requiredRoles.includes(userWithRole.role);
}
