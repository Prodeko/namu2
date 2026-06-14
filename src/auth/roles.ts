/**
 * Edge-safe role utilities shared by middleware, the NextAuth callbacks and the
 * session helper.
 *
 * This module must stay free of `@prisma/client` (and any other Node-only
 * import) because it runs inside the Next.js edge middleware. Roles are plain
 * string literals here; they are structurally identical to the Prisma `Role`
 * enum, so values flow between the two without conversion.
 */

export type AppRole = "USER" | "ADMIN" | "SUPERADMIN";

export const isAppRole = (value: unknown): value is AppRole =>
  value === "USER" || value === "ADMIN" || value === "SUPERADMIN";

/**
 * Precedence used to pick the strongest role when more than one is available.
 * Higher number wins.
 */
const ROLE_PRECEDENCE: Record<AppRole, number> = {
  USER: 0,
  ADMIN: 1,
  SUPERADMIN: 2,
};

/**
 * Maps Keycloak realm/client roles to namukilke app roles. A user holding
 * `namukilke-superadmin` in Keycloak becomes a SUPERADMIN; `namukilke-admin`
 * becomes an ADMIN. Anything else is ignored (the DB role still applies).
 */
export const KEYCLOAK_ROLE_MAP: Record<string, AppRole> = {
  "namukilke-admin": "ADMIN",
  "namukilke-superadmin": "SUPERADMIN",
};

/**
 * Returns the strongest of two app roles, or `undefined` if neither is set.
 * Used to combine the DB `User.role` with any role granted through Keycloak.
 */
export const resolveEffectiveRole = (
  dbRole?: AppRole,
  keycloakRole?: AppRole,
): AppRole | undefined => {
  if (!dbRole) return keycloakRole;
  if (!keycloakRole) return dbRole;
  return ROLE_PRECEDENCE[keycloakRole] > ROLE_PRECEDENCE[dbRole]
    ? keycloakRole
    : dbRole;
};

/** Decodes a base64url string in both Node and edge runtimes. */
const decodeBase64Url = (input: string): string => {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  // `atob` is available in the edge runtime and modern Node; `Buffer` is the
  // Node fallback. We try `atob` first to stay edge-safe.
  if (typeof atob === "function") {
    const binary = atob(padded);
    // Re-decode as UTF-8 so multi-byte claims survive.
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  return Buffer.from(padded, "base64").toString("utf-8");
};

/**
 * Extracts the highest-precedence app role granted to a user by Keycloak.
 *
 * The Keycloak access token is a JWT; we read its roles from both
 * `realm_access.roles` and `resource_access[clientId].roles`, map them through
 * {@link KEYCLOAK_ROLE_MAP} and return the strongest match.
 *
 * The token comes straight from the Keycloak token endpoint over TLS, so we do
 * not verify its signature here — we only read claims.
 */
export const extractKeycloakRole = (
  accessToken: string,
  clientId: string | undefined = process.env.AUTH_KEYCLOAK_ID,
): AppRole | undefined => {
  try {
    const payloadSegment = accessToken.split(".")[1];
    if (!payloadSegment) return undefined;

    const payload = JSON.parse(decodeBase64Url(payloadSegment)) as {
      realm_access?: { roles?: unknown };
      resource_access?: Record<string, { roles?: unknown }>;
    };

    const realmRoles = Array.isArray(payload.realm_access?.roles)
      ? (payload.realm_access?.roles as unknown[])
      : [];
    const clientRoles =
      clientId &&
      Array.isArray(payload.resource_access?.[clientId]?.roles)
        ? (payload.resource_access?.[clientId]?.roles as unknown[])
        : [];

    let best: AppRole | undefined;
    for (const raw of [...realmRoles, ...clientRoles]) {
      if (typeof raw !== "string") continue;
      const mapped = KEYCLOAK_ROLE_MAP[raw];
      if (mapped) best = resolveEffectiveRole(best, mapped);
    }
    return best;
  } catch (error) {
    console.error("Failed to extract Keycloak role from access token", error);
    return undefined;
  }
};
