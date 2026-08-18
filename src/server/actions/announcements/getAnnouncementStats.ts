"use server";

import { getAppSession } from "@/auth/session";
import { db } from "@/server/db/prisma";
import { type AnnouncementStatus, Role } from "@prisma/client";

export type AnnouncementCounts = Record<AnnouncementStatus, number>;

export interface AnnouncementStats {
  /** Total user count, used to derive the "never interacted" figure. */
  totalUsers: number;
  /** Per-announcement status counts, keyed by announcement id. */
  byAnnouncement: Record<string, AnnouncementCounts>;
}

const emptyCounts = (): AnnouncementCounts => ({
  SNOOZED: 0,
  DISMISSED: 0,
  COMPLETED: 0,
});

/** Aggregate per-announcement engagement counts. Superadmin only. */
export const getAnnouncementStats = async (): Promise<AnnouncementStats> => {
  const session = await getAppSession();
  if (session?.user?.role !== Role.SUPERADMIN) throw new Error("Unauthorized");

  const [grouped, totalUsers] = await Promise.all([
    db.userAnnouncementState.groupBy({
      by: ["announcementId", "status"],
      _count: { _all: true },
    }),
    db.user.count(),
  ]);

  const byAnnouncement: Record<string, AnnouncementCounts> = {};
  for (const row of grouped) {
    const counts =
      byAnnouncement[row.announcementId] ??
      (byAnnouncement[row.announcementId] = emptyCounts());
    counts[row.status] = row._count._all;
  }

  return { totalUsers, byAnnouncement };
};
