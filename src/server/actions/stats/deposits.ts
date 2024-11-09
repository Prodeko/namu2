"use server";

import { db } from "@/server/db/prisma";

const msInWeek = 7 * 24 * 60 * 60 * 1000;
const msInMonth = 30 * 24 * 60 * 60 * 1000;
const msInYear = 365 * 24 * 60 * 60 * 1000;

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

export const getDayDepositStats = async (startDate: Date) => {
  const startOfDay = new Date(startDate.getTime());
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startDate.getTime());
  endOfDay.setHours(23, 59, 59, 999);
  return getDepostitData(startOfDay, endOfDay);
};

export const getWeekDepositStats = async (startDate: Date) =>
  getDepostitData(startDate, new Date(startDate.getTime() + msInWeek - 1));

export const getMonthDepositStats = async (startDate: Date) =>
  getDepostitData(startDate, new Date(startDate.getTime() + msInMonth - 1));

export const getYearDepositStats = async (startDate: Date) =>
  getDepostitData(startDate, new Date(startDate.getTime() + msInYear - 1));

/**
 * Get the average amount deposited in one deposit
 * @returns {Promise<number>} The average deposit amount
 */
export const getAverageDeposit = async () => {
  const result = await db.deposit.aggregate({
    _avg: {
      amount: true,
    },
  });

  return result._avg.amount?.toNumber() || 0;
};
