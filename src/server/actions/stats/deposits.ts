"use server";

import { db } from "@/server/db/prisma";

import { TimeseriesDatapoint } from "./transactions";

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
export const getDepositData = async (
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

/**
 * Get the count of deposits grouped by deposit method between the given dates
 */
export const getDepositMethodStats = async (startDate: Date, endDate: Date) => {
  const result = await db.deposit.groupBy({
    by: ["depositMethod"],
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
  return result.map((entry) => {
    return {
      depositMethod: entry.depositMethod || "Unknown",
      count: entry._count._all,
    };
  });
};

/**
 * Gets the total sum of deposits netween the given dates grouped by month
 * @param startDate
 * @param endDate
 * @returns {Promise<TimeseriesDatapoint[]>} The total sum of deposits between the given dates grouped by month
 */
export const getDepositStatsByMonth = async (
  startDate: Date,
  endDate: Date,
): Promise<TimeseriesDatapoint[]> => {
  const result = await db.$queryRaw`
  SELECT
    date_series.month AS date,
    COALESCE(SUM("amount"), 0) AS value
  FROM
    generate_series(
      DATE_TRUNC('month', ${startDate}::date),
      DATE_TRUNC('month', ${endDate}::date),
      INTERVAL '1 month'
    ) AS date_series(month)
  LEFT JOIN
    "Deposit" ON DATE_TRUNC('month', "createdAt") = date_series.month
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
 * Gets the total sum of deposits between the given dates grouped by day
 * @param startDate
 * @param endDate
 * @returns {Promise<TimeseriesDatapoint[]>} The total sum of deposits between the given dates grouped by day
 */
export const getDepositStatsByDay = async (
  startDate: Date,
  endDate: Date,
): Promise<TimeseriesDatapoint[]> => {
  const result = await db.$queryRaw`
    SELECT
      date_series.date AS date,
      COALESCE(SUM("amount"), 0) AS value
    FROM
      generate_series(${startDate}::date, ${endDate}::date, INTERVAL '1 day') AS date_series(date)
    LEFT JOIN
      "Deposit" ON DATE("createdAt") = date_series.date
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
 * Gets the total sum of deposits between the given dates grouped by week
 * @param startDate
 * @param endDate
 * @returns {Promise<TimeseriesDatapoint[]>} The total sum of deposits between the given dates grouped by week
 */
export const getDepositStatsByWeek = async (
  startDate: Date,
  endDate: Date,
): Promise<TimeseriesDatapoint[]> => {
  const result = await db.$queryRaw`
    SELECT
      week_series.week_start AS date,
      COALESCE(SUM("amount"), 0) AS value
    FROM
      generate_series(
        DATE_TRUNC('week', ${startDate}::date),
        DATE_TRUNC('week', ${endDate}::date),
        INTERVAL '1 week'
      ) AS week_series(week_start)
    LEFT JOIN
      "Deposit" ON DATE_TRUNC('week', "Deposit"."createdAt") = week_series.week_start
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
 * Gets the total sum of deposits between the given dates grouped by hour
 * @param startDate
 * @param endDate
 * @returns {Promise<TimeseriesDatapoint[]>} The total sum of deposits between the given dates grouped by hour
 */
export const getDepositStatsByHour = async (
  startDate: Date,
  endDate: Date,
): Promise<TimeseriesDatapoint[]> => {
  const result = await db.$queryRaw`
    SELECT
      hour_series.hour_start AS date,
      COALESCE(SUM("amount"), 0) AS value
    FROM
      generate_series(
        ${startDate}::timestamp,
        ${endDate}::timestamp,
        INTERVAL '1 hour'
      ) AS hour_series(hour_start)
    LEFT JOIN
      "Deposit" ON DATE_TRUNC('hour', "Deposit"."createdAt") = hour_series.hour_start
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
