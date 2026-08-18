import { redirect } from "next/navigation";

import { getAppSession } from "@/auth/session";
import { getAnnouncementStats } from "@/server/actions/announcements/getAnnouncementStats";
import { db } from "@/server/db/prisma";
import { Role } from "@prisma/client";

import { AnnouncementAdminList } from "./AnnouncementAdminList";

const AnnouncementsAdminPage = async () => {
  const session = await getAppSession();
  if (session?.user?.role !== Role.SUPERADMIN) redirect("/admin/edit-products");

  const [settings, stats] = await Promise.all([
    db.announcementSetting.findMany({ select: { id: true, isActive: true } }),
    getAnnouncementStats(),
  ]);

  const initialActive: Record<string, boolean> = {};
  for (const setting of settings) initialActive[setting.id] = setting.isActive;

  return (
    <div className="flex w-full justify-center">
      <AnnouncementAdminList initialActive={initialActive} stats={stats} />
    </div>
  );
};

export default AnnouncementsAdminPage;
