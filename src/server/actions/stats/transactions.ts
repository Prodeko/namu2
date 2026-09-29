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

export type SalesData = {
  productId: number;
  productName: string;
  totalSales: number;
  totalQuantitySold: number;
  transactionCount: number;
};

type SalesDataRaw = {
  productId: number | bigint;
  productName: string;
  totalSales: Decimal | number;
  totalQuantitySold: bigint | number;
  transactionCount: bigint | number;
};

export const getSalesDataGroupedByProduct = async (
  startDate: Date,
  endDate: Date,
): Promise<SalesData[]> => {
  if (endDate <= startDate) {
    throw new Error("endDate must be after startDate");
  }
  const salesData = await db.$queryRaw<SalesDataRaw[]>`
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

  // SUM(numeric) is returned as Decimal and SUM(int)/COUNT as bigint. Neither
  // can be passed to client components, so convert to plain numbers.
  return salesData.map((row) => ({
    productId: Number(row.productId),
    productName: row.productName,
    totalSales: Number(row.totalSales),
    totalQuantitySold: Number(row.totalQuantitySold),
    transactionCount: Number(row.transactionCount),
  }));
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

export type ProductSalesPeriod = "daily" | "weekly" | "monthly" | "yearly";

/**
 * Gets the total sales of a single product between the given dates, bucketed
 * exactly like the total sales charts: by hour (daily), day (weekly), week
 * (monthly) or month (yearly). Buckets without sales have a value of 0.
 *
 * The product filter lives in the LEFT JOIN condition (not in WHERE) so that
 * empty buckets are preserved.
 * @param productId
 * @param startDate
 * @param endDate
 * @param period The period of the stats, which decides the bucket size
 * @returns {Promise<TimeseriesDatapoint[]>} One datapoint per bucket
 */
export const getProductSalesTimeseries = async (
  productId: number,
  startDate: Date,
  endDate: Date,
  period: ProductSalesPeriod,
): Promise<TimeseriesDatapoint[]> => {
  let result: TimeseriesDatapointRaw[];
  switch (period) {
    case "daily":
      result = await db.$queryRaw<TimeseriesDatapointRaw[]>`
        SELECT
          hour_series.hour_start AS date,
          COALESCE(SUM(ti."totalPrice"), 0) AS value
        FROM
          generate_series(
            ${startDate}::timestamp,
            ${endDate}::timestamp,
            INTERVAL '1 hour'
          ) AS hour_series(hour_start)
        LEFT JOIN (
          "Transaction" t
          JOIN "TransactionItem" ti
            ON ti."transactionId" = t."id" AND ti."productId" = ${productId}
        ) ON DATE_TRUNC('hour', t."createdAt") = hour_series.hour_start
        GROUP BY
          hour_series.hour_start
        ORDER BY
          hour_series.hour_start ASC
      `;
      break;
    case "weekly":
      result = await db.$queryRaw<TimeseriesDatapointRaw[]>`
        SELECT
          date_series.date AS date,
          COALESCE(SUM(ti."totalPrice"), 0) AS value
        FROM
          generate_series(${startDate}::date, ${endDate}::date, INTERVAL '1 day') AS date_series(date)
        LEFT JOIN (
          "Transaction" t
          JOIN "TransactionItem" ti
            ON ti."transactionId" = t."id" AND ti."productId" = ${productId}
        ) ON DATE(t."createdAt") = date_series.date
        GROUP BY
          date_series.date
        ORDER BY
          date_series.date ASC
      `;
      break;
    case "monthly":
      result = await db.$queryRaw<TimeseriesDatapointRaw[]>`
        SELECT
          week_series.week_start AS date,
          COALESCE(SUM(ti."totalPrice"), 0) AS value
        FROM
          generate_series(
            DATE_TRUNC('week', ${startDate}::date),
            DATE_TRUNC('week', ${endDate}::date),
            INTERVAL '1 week'
          ) AS week_series(week_start)
        LEFT JOIN (
          "Transaction" t
          JOIN "TransactionItem" ti
            ON ti."transactionId" = t."id" AND ti."productId" = ${productId}
        ) ON DATE_TRUNC('week', t."createdAt") = week_series.week_start
        GROUP BY
          week_series.week_start
        ORDER BY
          week_series.week_start ASC
      `;
      break;
    case "yearly":
      result = await db.$queryRaw<TimeseriesDatapointRaw[]>`
        SELECT
          date_series.month AS date,
          COALESCE(SUM(ti."totalPrice"), 0) AS value
        FROM
          generate_series(
            DATE_TRUNC('month', ${startDate}::date),
            DATE_TRUNC('month', ${endDate}::date),
            INTERVAL '1 month'
          ) AS date_series(month)
        LEFT JOIN (
          "Transaction" t
          JOIN "TransactionItem" ti
            ON ti."transactionId" = t."id" AND ti."productId" = ${productId}
        ) ON DATE_TRUNC('month', t."createdAt") = date_series.month
        GROUP BY
          date_series.month
        ORDER BY
          date_series.month ASC
      `;
      break;
    default:
      throw new Error(`Unknown period: ${period satisfies never}`);
  }
  return result.map((datapoint) => ({
    date: datapoint.date,
    value: Number(datapoint.value),
  }));
};
