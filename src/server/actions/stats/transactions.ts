"use server";

import { db } from "@/server/db/prisma";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type TransactionStats = {
  amount: number;
  sum: number;
  average: number;
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

export type TimeUnit = "hour" | "day" | "week" | "month";

const timeUnits: readonly TimeUnit[] = ["hour", "day", "week", "month"];

/**
 * The rows that sales are counted from: either every transaction, or the
 * items of a single product. `amount` is what each row adds to the sales.
 */
const salesSource = (productId?: number) =>
  productId === undefined
    ? Prisma.sql`SELECT "createdAt", "totalPrice" AS amount FROM "Transaction"`
    : Prisma.sql`
        SELECT t."createdAt", ti."totalPrice" AS amount
        FROM "TransactionItem" ti
        JOIN "Transaction" t ON ti."transactionId" = t."id"
        WHERE ti."productId" = ${productId}`;

/**
 * Gets the sales between the given dates bucketed by the given time unit.
 * Buckets without sales have a value of 0.
 * @param startDate
 * @param endDate
 * @param unit The size of one bucket
 * @param productId Only count the sales of this product. Omit for all sales.
 */
export const getSalesTimeseries = async (
  startDate: Date,
  endDate: Date,
  unit: TimeUnit,
  productId?: number,
): Promise<TimeseriesDatapoint[]> => {
  if (!timeUnits.includes(unit)) {
    throw new Error(`Unknown time unit: ${unit}`);
  }
  const result = await db.$queryRaw<TimeseriesDatapointRaw[]>`
    WITH sales AS (${salesSource(productId)})
    SELECT bucket AS date, COALESCE(SUM(sales.amount), 0) AS value
    FROM generate_series(
      DATE_TRUNC(${unit}, ${startDate}::timestamp),
      DATE_TRUNC(${unit}, ${endDate}::timestamp),
      ${`1 ${unit}`}::interval
    ) AS bucket
    LEFT JOIN sales ON DATE_TRUNC(${unit}, sales."createdAt") = bucket
    GROUP BY bucket
    ORDER BY bucket ASC
  `;
  return result.map((datapoint) => ({
    date: datapoint.date,
    value: Number(datapoint.value),
  }));
};

/**
 * Gets the total, average and count of sales between the given dates.
 * @param startDate
 * @param endDate
 * @param productId Only count the sales of this product. Omit for all sales.
 */
export const getSalesStats = async (
  startDate: Date,
  endDate: Date,
  productId?: number,
): Promise<TransactionStats> => {
  const [row] = await db.$queryRaw<
    { amount: bigint; sum: Decimal; average: Decimal }[]
  >`
    WITH sales AS (${salesSource(productId)})
    SELECT
      COUNT(*) AS amount,
      COALESCE(SUM(amount), 0) AS sum,
      COALESCE(AVG(amount), 0) AS average
    FROM sales
    WHERE "createdAt" BETWEEN ${startDate} AND ${endDate}
  `;
  return {
    amount: Number(row?.amount ?? 0),
    sum: Number(row?.sum ?? 0),
    average: Number(row?.average ?? 0),
  };
};
