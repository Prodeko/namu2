import { db } from "@/server/db/prisma";

/**
 * A server-side completion condition for an announcement. Returns `true` when
 * the user has *already done the thing the announcement asks for* — in which
 * case the announcement is never shown and is back-filled to COMPLETED.
 *
 * Conditions live here, not in the (client-bundled) announcement registry, so
 * that database access never leaks into the client bundle. They are keyed by
 * announcement id; an announcement with no entry simply has no condition.
 */
export type AnnouncementCondition = (userId: number) => Promise<boolean>;

export const ANNOUNCEMENT_CONDITIONS: Partial<
  Record<string, AnnouncementCondition>
> = {
  // Satisfied once the user has linked a Prodeko (Keycloak) account.
  "prodeko-account-linking": async (userId) =>
    !!(await db.keycloakUser.findUnique({
      where: { userId },
      select: { id: true },
    })),
  // Satisfied once the user has registered an RFID access card.
  "rfid-login-setup": async (userId) =>
    (
      await db.user.findUnique({
        where: { id: userId },
        select: { nfcSerialHash: true },
      })
    )?.nfcSerialHash != null,
};
