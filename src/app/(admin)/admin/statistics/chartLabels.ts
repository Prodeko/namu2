import { getWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import type { TimeseriesDatapoint } from "@/server/actions/stats/transactions";

import type { StatsPeriod } from "./page";

/** Formats the x-axis label of a chart bucket for each stats period. */
export const chartLabelGetters: Record<
  StatsPeriod,
  (point: TimeseriesDatapoint) => string
> = {
  daily: (d) => formatInTimeZone(d.date, "Europe/Helsinki", "HH:mm"),
  weekly: (d) => formatInTimeZone(d.date, "Europe/Helsinki", "EEEE"),
  monthly: (d) => `Week ${getWeek(d.date)}`,
  yearly: (d) => formatInTimeZone(d.date, "Europe/Helsinki", "MMM"),
};

/** The unit that one bar of the chart represents for each stats period. */
export const periodBucketUnit: Record<StatsPeriod, string> = {
  daily: "hour",
  weekly: "day",
  monthly: "week",
  yearly: "month",
};
