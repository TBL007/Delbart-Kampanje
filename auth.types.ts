import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      isAdmin: boolean;
      expiresAt: number;
    } & DefaultSession["user"];
  }

  interface User {
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string;
    isAdmin?: boolean;
    expiresAt?: number;
  }
}
