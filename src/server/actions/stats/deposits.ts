"use server";

import { db } from "@/server/db/prisma";

const msInWeek = 7 * 24 * 60 * 60 * 1000;
const msInMonth = 30 * 24 * 60 * 60 * 1000;
const msInYear = 365 * 24 * 60 * 60 * 1000;

/**
 * Get the total amount and sum of deposits in the given time frame
 * @param {Date} startDate The start date of the time frame
 * @param {Date} endDate The end date of the time frame
 * @returns {Promise<{amount: number, sum: int}>} The total amount and sum of deposits in the given time frame
 */
export const getDepostitData = async (startDate: Date, endDate: Date) => {
  const result = await db.deposit.aggregate({
    _sum: {
      amount: true,
    },
    _count: {
      _all: true,
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
    sum: result._sum.amount?.toNumber(),
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
