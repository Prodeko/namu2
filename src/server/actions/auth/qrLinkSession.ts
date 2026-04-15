"use server";

import crypto from "node:crypto";

import { getAppSession } from "@/auth/session";
import { serverEnv } from "@/env/server.mjs";
import { db } from "@/server/db/prisma";

const LINK_SESSION_TTL_SECONDS = 10 * 60; // 10 minutes

/**
 * Creates a short-lived QR link session for the current logged-in user.
 * Called from the guildroom tablet when the user wants to link their Prodeko
 * account via QR code. Cleans up any stale ACTIVE sessions for this user.
 */
export async function createKeycloakLinkSession(): Promise<
  { ok: true; id: string; url: string } | { ok: false; message: string }
> {
  const session = await getAppSession();
  const userId = session?.user?.userId;
  if (!userId) {
    return { ok: false, message: "Not authenticated" };
  }

  const now = new Date();

  await db.keycloakLinkSession.deleteMany({
    where: {
      userId,
      status: "ACTIVE",
      expiresAt: { lt: now },
    },
  });

  const id = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + LINK_SESSION_TTL_SECONDS * 1000);

  await db.keycloakLinkSession.create({
    data: { id, userId, expiresAt },
  });

  const url = `${serverEnv.NEXTAUTH_URL}/api/auth/link?id=${id}`;
  return { ok: true, id, url };
}

/**
 * Polls the status of a QR link session. Only the owning user may query it.
 */
export async function getKeycloakLinkSessionStatus(id: string): Promise<{
  status: "ACTIVE" | "COMPLETED" | "EXPIRED" | "NOT_FOUND";
}> {
  const session = await getAppSession();
  const userId = session?.user?.userId;
  if (!userId) {
    return { status: "NOT_FOUND" };
  }

  const row = await db.keycloakLinkSession.findUnique({ where: { id } });

  if (!row || row.userId !== userId) {
    return { status: "NOT_FOUND" };
  }

  if (row.status === "COMPLETED") {
    return { status: "COMPLETED" };
  }

  if (row.expiresAt < new Date()) {
    return { status: "EXPIRED" };
  }

  return { status: "ACTIVE" };
}

