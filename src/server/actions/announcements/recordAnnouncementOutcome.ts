"use server";

import { getAppSession } from "@/auth/session";
import type { AnnouncementOutcome } from "@/common/announcements/types";
import { db } from "@/server/db/prisma";
import { AnnouncementStatus } from "@prisma/client";

const STATUS_BY_OUTCOME: Record<AnnouncementOutcome, AnnouncementStatus> = {
  snooze: AnnouncementStatus.SNOOZED,
  dismiss: AnnouncementStatus.DISMISSED,
  complete: AnnouncementStatus.COMPLETED,
};

/**
 * Persist the user's decision for an announcement. Called only when the user
 * makes an explicit choice — dismissing the modal with X/Escape writes nothing,
 * so the announcement is simply re-shown on the next login. `lastShownAt` is
 * maintained automatically (the column is `@updatedAt`).
 */
export const recordAnnouncementOutcome = async (
  announcementId: string,
  outcome: AnnouncementOutcome,
): Promise<void> => {
  const session = await getAppSession();
  const userId = session?.user?.userId;
  if (typeof userId !== "number") throw new Error("Unauthorized");

  const status = STATUS_BY_OUTCOME[outcome];

  await db.userAnnouncementState.upsert({
    where: { userId_announcementId: { userId, announcementId } },
    create: { userId, announcementId, status },
    update: { status },
  });
};
