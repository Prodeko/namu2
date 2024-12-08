"use server";

import { db } from "@/server/db/prisma";
import { WishStatus } from "@prisma/client";

/**
 * Get the total number of wishes in the database
 * @returns {Promise<number>} The number of wishes in the database
 */
export const getWishCount = async () => db.wish.count();

type WishCountData = {
  [key in WishStatus]: number;
} & { total: number };

/**
 * Get the number of wishes in the db grouped by status
 * @returns {Promise<number>} The number of fulfilled wishes in the database
 */
export const getWishCountByStatus = async (): Promise<WishCountData> => {
  const wishCounts = await db.wish.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  const result: WishCountData = {
    OPEN: 0,
    ACCEPTED: 0,
    REJECTED: 0,
    total: 0,
  };

  for (const wishCount of wishCounts) {
    const status = wishCount.status as WishStatus;
    result[status] = wishCount._count.status;
    result.total += wishCount._count.status;
  }

  return result;
};
