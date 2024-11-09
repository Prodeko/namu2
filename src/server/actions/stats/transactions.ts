"use server";

import { db } from "@/server/db/prisma";

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

type SalesData = {
  productId: number;
  productName: string;
  totalSales: number;
  totalQuantitySold: number;
  transactionCount: number;
};

export const getSalesDataGroupedByProduct = async () => {
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
