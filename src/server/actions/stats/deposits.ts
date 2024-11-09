"use server";

import { db } from "@/server/db/prisma";

export type DepositStats = {
  amount: number;
  sum: number;
  average: number;
};

/**
 * Get the total amount and sum of deposits in the given time frame
 * @param {Date} startDate The start date of the time frame
 * @param {Date} endDate The end date of the time frame
 * @returns {Promise<DepositStats>} The total amount and sum of deposits in the given time frame
 */
export const getDepostitData = async (
  startDate: Date,
  endDate: Date,
): Promise<DepositStats> => {
  const result = await db.deposit.aggregate({
    _sum: {
      amount: true,
    },
    _count: {
      _all: true,
    },
    _avg: {
      amount: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return {
    amount: result._count._all,
    sum: result._sum.amount?.toNumber() || 0,
    average: result._avg.amount?.toNumber() || 0,
  };
};
