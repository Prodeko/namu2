"use server";

import { db } from "@/server/db/prisma";

/**
 * Get the total sum of currently active balances
 * @returns {Promise<number>} The total sum of balances in the given time frame
 */
export const getActiveBalanceSum = async (): Promise<number> => {
  const result = await db.userBalance.aggregate({
    _sum: {
      balance: true,
    },
    where: {
      isActive: true,
    },
  });
  return result._sum.balance?.toNumber() || 0;
};
