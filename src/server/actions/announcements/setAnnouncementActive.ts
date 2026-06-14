"use server";

import { revalidatePath } from "next/cache";

import { getAppSession } from "@/auth/session";
import { db } from "@/server/db/prisma";
import { Role } from "@prisma/client";

/** Switch an announcement on or off. Superadmin only. */
export const setAnnouncementActive = async (
  id: string,
  isActive: boolean,
): Promise<void> => {
  const session = await getAppSession();
  if (session?.user?.role !== Role.SUPERADMIN) throw new Error("Unauthorized");

  await db.announcementSetting.upsert({
    where: { id },
    create: { id, isActive },
    update: { isActive },
  });

  revalidatePath("/admin/announcements");
};
