"use server";

import { getServerSession } from "next-auth";

import { resolveEffectiveRole } from "@/auth/roles";
import { Role } from "@prisma/client";

type AppSession = {
  user: {
    userId: number;
    /** Effective role: the strongest of the DB role and any Keycloak role. */
    role: Role;
    /** The raw namukilke DB role, before combining with Keycloak. */
    dbRole?: Role;
    /** The role granted through Keycloak, if any. */
    keycloakRole?: Role;
    keycloakSub?: string;
  };
};

const isRole = (value: unknown): value is Role =>
  value === "USER" || value === "ADMIN" || value === "SUPERADMIN";

export const getAppSession = async (): Promise<AppSession | undefined> => {
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(authOptions);

  // A session is only authenticated once it is linked to a namu account
  // (userId). An unlinked Keycloak user mid-signup is treated as
  // unauthenticated even if they hold a namukilke role in Keycloak.
  const userId = session?.user?.userId;
  if (typeof userId !== "number") {
    return undefined;
  }

  const dbRole = isRole(session?.user?.role) ? session?.user?.role : undefined;
  const keycloakRole = isRole(session?.user?.keycloakRole)
    ? session?.user?.keycloakRole
    : undefined;
  const role = resolveEffectiveRole(dbRole, keycloakRole);
  if (!isRole(role)) {
    return undefined;
  }

  return {
    user: {
      userId,
      role,
      dbRole,
      keycloakRole,
      keycloakSub: session?.user?.keycloakSub,
    },
  };
};
