"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/auth/ironsession";
import { db } from "@/server/db/prisma";
import { Role } from "@prisma/client";

export const changeUserRole = async (userId: number, role: Role) => {
  const session = await getSession();
  const userRole = session?.user?.role;
  if (userRole !== Role.SUPERADMIN) throw new Error("Unauthorized");
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });
  revalidatePath("/admin/superadmin");
};
