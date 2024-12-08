"use server";

import { db } from "@/server/db/prisma";
import { Decimal } from "@prisma/client/runtime/library";

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

export const getSalesDataGroupedByProduct = async (
  startDate: Date,
  endDate: Date,
) => {
  if (endDate <= startDate) {
    throw new Error("endDate must be after startDate");
  }
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
      "Transaction" t ON ti."transactionId" = t."id"
    JOIN 
      "Product" p ON ti."productId" = p."id"
    WHERE 
      t."createdAt" BETWEEN ${startDate} AND ${endDate}
    GROUP BY 
      ti."productId", p."name"
  `;

  return salesData as SalesData[];
};

export type TimeseriesDatapoint = {
  date: Date;
  value: number;
};

export type TimeseriesDatapointRaw = {
  date: Date;
  value: Decimal;
};

/**
 * Gets the total sum of transactions between the given dates grouped by month
 * @param startDate
 * @param endDate
 * @returns {Promise<TimeseriesDatapoint[]>} The total sum of transactions between the given dates grouped by month
 */
export const getTransactionStatsByMonth = async (
  startDate: Date,
  endDate: Date,
): Promise<TimeseriesDatapoint[]> => {
  const result = await db.$queryRaw<TimeseriesDatapointRaw[]>`
    SELECT
      date_series.month AS date,
      COALESCE(SUM("totalPrice"), 0) AS value
    FROM
      generate_series(
        DATE_TRUNC('month', ${startDate}::date),
        DATE_TRUNC('month', ${endDate}::date),
        INTERVAL '1 month'
      ) AS date_series(month)
    LEFT JOIN
      "Transaction" ON DATE_TRUNC('month', "createdAt") = date_series.month
    GROUP BY
      date_series.month
    ORDER BY
      date_series.month ASC
  `;
  const mappedresult = result.map((datapoint) => {
    return { date: datapoint.date, value: datapoint.value.toNumber() };
  });
  return mappedresult as TimeseriesDatapoint[];
};

/**
 * Gets the total sum of transactions between the given dates grouped by day
 * @param startDate
 * @param endDate
 * @returns {Promise<TimeseriesDatapoint[]>} The total sum of transactions between the given dates grouped by day
 */
export const getTransactionStatsByDay = async (
  startDate: Date,
  endDate: Date,
): Promise<TimeseriesDatapoint[]> => {
  const result = await db.$queryRaw<TimeseriesDatapointRaw[]>`
    SELECT
      date_series.date AS date,
      COALESCE(SUM("totalPrice"), 0) AS value
    FROM
      generate_series(${startDate}::date, ${endDate}::date, INTERVAL '1 day') AS date_series(date)
    LEFT JOIN
      "Transaction" ON DATE("createdAt") = date_series.date
    GROUP BY
      date_series.date
    ORDER BY
      date_series.date ASC
  `;
  const mappedresult = result.map((datapoint) => {
    return { date: datapoint.date, value: datapoint.value.toNumber() };
  });
  return mappedresult as TimeseriesDatapoint[];
};

/**
 * Gets the total sum of transactions between the given dates grouped by week
 * @param startDate
 * @param endDate
 * @returns {Promise<TimeseriesDatapoint[]>} The total sum of transactions between the given dates grouped by week
 */
export const getTransactionStatsByWeek = async (
  startDate: Date,
  endDate: Date,
): Promise<TimeseriesDatapoint[]> => {
  const result = await db.$queryRaw<TimeseriesDatapointRaw[]>`
    SELECT
      week_series.week_start AS date,
      COALESCE(SUM("totalPrice"), 0) AS value
    FROM
      generate_series(
        DATE_TRUNC('week', ${startDate}::date),
        DATE_TRUNC('week', ${endDate}::date),
        INTERVAL '1 week'
      ) AS week_series(week_start)
    LEFT JOIN
      "Transaction" ON DATE_TRUNC('week', "Transaction"."createdAt") = week_series.week_start
    GROUP BY
      week_series.week_start
    ORDER BY
      week_series.week_start ASC
  `;
  const mappedresult = result.map((datapoint) => {
    return { date: datapoint.date, value: datapoint.value.toNumber() };
  });
  return mappedresult as TimeseriesDatapoint[];
};

/**
 * Gets the total sum of transactions between the given dates grouped by hour
 * @param startDate
 * @param endDate
 * @returns {Promise<TimeseriesDatapoint[]>} The total sum of transactions between the given dates grouped by hour
 */
export const getTransactionStatsByHour = async (
  startDate: Date,
  endDate: Date,
): Promise<TimeseriesDatapoint[]> => {
  const result = await db.$queryRaw<TimeseriesDatapointRaw[]>`
    SELECT
      hour_series.hour_start AS date,
      COALESCE(SUM("totalPrice"), 0) AS value
    FROM
      generate_series(
        ${startDate}::timestamp,
        ${endDate}::timestamp,
        INTERVAL '1 hour'
      ) AS hour_series(hour_start)
    LEFT JOIN
      "Transaction" ON DATE_TRUNC('hour', "Transaction"."createdAt") = hour_series.hour_start
    GROUP BY
      hour_series.hour_start
    ORDER BY
      hour_series.hour_start ASC
  `;
  const mappedresult = result.map((datapoint) => {
    return { date: datapoint.date, value: datapoint.value.toNumber() };
  });
  return mappedresult as TimeseriesDatapoint[];
};
