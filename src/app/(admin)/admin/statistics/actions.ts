"use server";

import { getAppSession } from "@/auth/session";
import { getProductSalesTimeseries } from "@/server/actions/stats/transactions";

import { chartLabelGetters } from "./chartLabels";
import type { StatsPeriod } from "./page";

const periods: readonly StatsPeriod[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
];

/**
 * Sales chart data of a single product. The buckets are the same as in the
 * total sales chart of the given period.
 */
export const getProductSalesChart = async (
  productId: number,
  startMs: number,
  endMs: number,
  period: StatsPeriod,
): Promise<{ labels: string[]; values: number[] }> => {
  const session = await getAppSession();
  if (session?.user.role !== "ADMIN" && session?.user.role !== "SUPERADMIN") {
    throw new Error("Unauthorized");
  }
  if (!periods.includes(period)) {
    throw new Error("Invalid period");
  }
  if (
    !Number.isInteger(productId) ||
    !Number.isFinite(startMs) ||
    !Number.isFinite(endMs)
  ) {
    throw new Error("Invalid arguments");
  }
  const startDate = new Date(startMs);
  const endDate = new Date(endMs);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error("Invalid dates");
  }
  if (endDate <= startDate) {
    throw new Error("endDate must be after startDate");
  }

  const datapoints = await getProductSalesTimeseries(
    productId,
    startDate,
    endDate,
    period,
  );
  return {
    labels: datapoints.map(chartLabelGetters[period]),
    values: datapoints.map((p) => p.value),
  };
};
