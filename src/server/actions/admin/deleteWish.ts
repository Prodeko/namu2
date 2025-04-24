"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/server/db/prisma";

export const deleteWish = async (wishId: number) => {
  await db.wishLike.deleteMany({
    where: {
      wishId: wishId,
    },
  });
  await db.wish.delete({
    where: {
      id: wishId,
    },
    include: {
      WishLike: true,
    },
  });
  revalidatePath("/admin/wishes");
  redirect("/admin/wishes");
  return wishId;
};
