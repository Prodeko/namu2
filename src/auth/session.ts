"use server";

import { getServerSession } from "next-auth";

import { getSession as getLegacySession } from "@/auth/ironsession";
import { Role } from "@prisma/client";

type AppSession = {
  user: {
    userId: number;
    role: Role;
    keycloakSub?: string;
  };
};

const isRole = (value: unknown): value is Role =>
  value === "USER" || value === "ADMIN" || value === "SUPERADMIN";

export const getAppSession = async (): Promise<AppSession | undefined> => {
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(authOptions);
  const userId = session?.user?.userId;
  const role = session?.user?.role;

  if (typeof userId === "number" && isRole(role) && session) {
    return {
      user: {
        userId,
        role,
        keycloakSub: session.user.keycloakSub,
      },
    };
  }

  const legacySession = await getLegacySession();
  if (!legacySession || !legacySession.user) {
    return undefined;
  }

  return {
    user: {
      userId: legacySession.user.userId,
      role: legacySession.user.role,
    },
  };
};
