import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string; // Add 'role' property to User type
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    role: string;
  }
}
