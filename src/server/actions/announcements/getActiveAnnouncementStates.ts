"use server";

import { getAppSession } from "@/auth/session";
import { db } from "@/server/db/prisma";

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

    return {
      activeIds: settings.map((setting) => setting.id),
      states,
    };
  };
