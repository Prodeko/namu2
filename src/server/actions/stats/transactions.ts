"use server";

import { db } from "@/server/db/prisma";
import { a } from "@react-spring/web";

const msInWeek = 7 * 24 * 60 * 60 * 1000;
const msInMonth = 30 * 24 * 60 * 60 * 1000;
const msInYear = 365 * 24 * 60 * 60 * 1000;

export type TransactionStats = {
  amount: number;
  sum: number;
  average: number;
};
/**
 * Get the total amount and sum of transactions in the given time frame
 * @param {Date} startDate The start date of the time frame
 * @param {Date} endDate The end date of the time frame
 * @returns {Promise<TransactionStats>} The total amount and sum of transactions in the given time frame
 */
export const getTransactionStats = async (
  startDate: Date,
  endDate: Date,
): Promise<TransactionStats> => {
  const result = await db.transaction.aggregate({
    _sum: {
      totalPrice: true,
    },
    _count: {
      _all: true,
    },
    _avg: {
      totalPrice: true,
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
    sum: result._sum.totalPrice?.toNumber() || 0,
    average: result._avg.totalPrice?.toNumber() || 0,
  };
};

export const getDayTransactionStats = async (startDate: Date) => {
  const startOfDay = new Date(startDate.getTime());
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startDate.getTime());
  endOfDay.setHours(23, 59, 59, 999);
  return getTransactionStats(startOfDay, endOfDay);
};

export const getWeekTransactionStats = async (startDate: Date) =>
  getTransactionStats(startDate, new Date(startDate.getTime() + msInWeek - 1));

export const getMonthTransactionStats = async (startDate: Date) =>
  getTransactionStats(startDate, new Date(startDate.getTime() + msInMonth - 1));

export const getYearTransactionStats = async (startDate: Date) =>
  getTransactionStats(startDate, new Date(startDate.getTime() + msInYear - 1));

/**
 *
 * @returns
 */
export const getSalesDataGroupedByProduct = async () => {
  const salesData = await db.transactionItem.groupBy({
    by: ["productId"],
    _sum: {
      totalPrice: true,
      quantity: true,
    },
    _count: {
      productId: true,
    },
  });

  // Format the result for easier consumption
  const formattedSalesData = salesData.map((data) => ({
    productId: data.productId,
    totalSales: data._sum.totalPrice?.toNumber() || 0,
    totalQuantitySold: data._sum.quantity,
    transactionCount: data._count.productId,
  }));

  return formattedSalesData;
};

type SalesData = {
  productId: number;
  productName: string;
  totalSales: number;
  totalQuantitySold: number;
  transactionCount: number;
};

export const getSalesDataGroupedByProduct2 = async () => {
  const salesData = await db.$queryRaw`
    SELECT 
      ti."productId",
      p."name" AS "productName",
      SUM(ti."totalPrice") AS "totalSales",
      SUM(ti."quantity") AS "totalQuantitySold",
      COUNT(ti."productId") AS "transactionCount"
    FROM 
      "TransactionItem" ti
    JOIN 
      "Product" p ON ti."productId" = p."id"
    GROUP BY 
      ti."productId", p."name"
  `;

  return salesData as SalesData[];
};
