import type { DefaultSession, DefaultUser } from "next-auth"
import type { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      email: string // Ensure email is required
    } & Omit<DefaultSession["user"], "email">
  }

  interface User extends DefaultUser {
    role: Role
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    email: string // Ensure email is required
  }
}