"use server";

import { getAppSession } from "@/auth/session";
import { ANNOUNCEMENT_CONDITIONS } from "@/server/actions/announcements/conditions";
import { db } from "@/server/db/prisma";
import { AnnouncementStatus } from "@prisma/client";

export interface UserAnnouncementStateDTO {
  announcementId: string;
  status: "SNOOZED" | "DISMISSED" | "COMPLETED";
  lastShownAt: Date;
}

export interface ActiveAnnouncementStates {
  /** Ids of announcements an admin has switched on. */
  activeIds: string[];
  /** The caller's per-announcement history. */
  states: UserAnnouncementStateDTO[];
}

/**
 * Returns the data the client needs to decide which announcement (if any) to
 * show: the set of active announcement ids and the caller's own history. The
 * device-type filter and snooze-delay math run on the client, where the device
 * type is known.
 *
 * As a side effect, this evaluates each active announcement's server-side
 * completion condition (see `conditions.ts`): for any announcement the user has
 * already satisfied — and whose status is not yet terminal — it back-fills a
 * COMPLETED row and drops the id from `activeIds`, so it is never shown and is
 * counted as completed in the admin stats. Conditions run regardless of device;
 * a thrown condition is logged and that announcement is skipped for this call.
 */
export const getActiveAnnouncementStates =
  async (): Promise<ActiveAnnouncementStates> => {
    const session = await getAppSession();
    const userId = session?.user?.userId;
    if (typeof userId !== "number") return { activeIds: [], states: [] };

    const [settings, states] = await Promise.all([
      db.announcementSetting.findMany({
        where: { isActive: true },
        select: { id: true },
      }),
      db.userAnnouncementState.findMany({
        where: { userId },
        select: { announcementId: true, status: true, lastShownAt: true },
      }),
    ]);

    const statusById = new Map(states.map((s) => [s.announcementId, s.status]));
    const activeIds = settings.map((setting) => setting.id);

    // Evaluate completion conditions for active announcements whose status is
    // still open (absent or SNOOZED). A satisfied condition back-fills COMPLETED
    // and removes the id so the client never shows it. DISMISSED/COMPLETED rows
    // are left untouched (already hidden, and we respect an explicit dismissal).
    const satisfiedIds = new Set<string>();
    await Promise.all(
      activeIds.map(async (id) => {
        const condition = ANNOUNCEMENT_CONDITIONS[id];
        if (!condition) return;
        const status = statusById.get(id);
        if (status === AnnouncementStatus.DISMISSED) return;
        if (status === AnnouncementStatus.COMPLETED) return;

        try {
          if (!(await condition(userId))) return;
        } catch (error) {
          console.error(
            `Announcement condition for "${id}" failed; skipping this call`,
            error,
          );
          return;
        }

        await db.userAnnouncementState.upsert({
          where: { userId_announcementId: { userId, announcementId: id } },
          create: {
            userId,
            announcementId: id,
            status: AnnouncementStatus.COMPLETED,
          },
          update: { status: AnnouncementStatus.COMPLETED },
        });
        satisfiedIds.add(id);
      }),
    );

    return {
      activeIds: activeIds.filter((id) => !satisfiedIds.has(id)),
      states,
    };
  };
