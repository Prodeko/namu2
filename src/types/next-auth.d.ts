import { DefaultSession } from "next-auth";

import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      userId?: number;
      role?: Role;
      keycloakRole?: Role;
      keycloakSub?: string;
      given_name?: string;
      family_name?: string;
    };
  }

  interface User {
    userId?: number;
    role?: Role | "USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: number;
    role?: Role | "USER";
    keycloakRole?: Role;
    keycloakSub?: string;
    given_name?: string;
    family_name?: string;
  }
}
