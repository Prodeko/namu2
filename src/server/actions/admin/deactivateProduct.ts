"use server";

import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

import { db } from "@/server/db/prisma";

export const deactivateProduct = async (productId: number) => {
  const product = await db.product.update({
    where: {
      id: productId,
    },
    data: {
      isActive: false,
    },
  });

  revalidatePath("/admin");
  redirect("/admin/edit-products", RedirectType.push);
};
