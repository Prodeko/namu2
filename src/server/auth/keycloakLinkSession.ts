import { db } from "@/server/db/prisma";

/**
 * Atomically claims a QR link session so the pending OAuth callback can link
 * the resulting Keycloak identity to the session's owning Namu user. Returns
 * the owning userId, or null if the session is missing/expired/already used.
 *
 * We flip ACTIVE → COMPLETED before the KeycloakUser row is created; if the
 * subsequent insert fails the user just retries with a fresh QR code. This is
 * the price of making consume a single atomic step.
 */
export async function consumeKeycloakLinkSession(
  sessionId: string,
  linkedKeycloakSub: string,
): Promise<{ userId: number } | null> {
  const now = new Date();
  const updated = await db.keycloakLinkSession.updateMany({
    where: {
      id: sessionId,
      status: "ACTIVE",
      expiresAt: { gt: now },
    },
    data: { status: "COMPLETED", linkedKeycloakSub },
  });

  if (updated.count === 0) return null;

  const row = await db.keycloakLinkSession.findUnique({
    where: { id: sessionId },
    select: { userId: true },
  });

  return row;
}
