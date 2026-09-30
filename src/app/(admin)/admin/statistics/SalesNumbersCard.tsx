import { getWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import { HiChevronLeft } from "react-icons/hi";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import {
  TimeUnit,
  TimeseriesDatapoint,
  getSalesStats,
  getSalesTimeseries,
} from "@/server/actions/stats/transactions";

import { HeadlinerStatistic } from "./HeadlinerStatistic";
import { StatisticsCard } from "./StatisticsCard";
import { AdminBarChart } from "./charts/AdminBarChart";
import { StatsPeriod, StatsTimeframe } from "./page";

interface Props extends ComponentPropsWithoutRef<"div"> {
  timeframe: StatsTimeframe;
  /** Show the sales of a single product instead of all sales. */
  product?: { id: number; name: string };
  /** When set, a back link to this URL is shown above the chart. */
  backHref?: string;
}

const chartBuckets: Record<
  StatsPeriod,
  { unit: TimeUnit; label: (point: TimeseriesDatapoint) => string }
> = {
  daily: {
    unit: "hour",
    label: (d) => formatInTimeZone(d.date, "Europe/Helsinki", "HH:mm"),
  },
  weekly: {
    unit: "day",
    label: (d) => formatInTimeZone(d.date, "Europe/Helsinki", "EEEE"),
  },
  monthly: { unit: "week", label: (d) => `Week ${getWeek(d.date)}` },
  yearly: {
    unit: "month",
    label: (d) => formatInTimeZone(d.date, "Europe/Helsinki", "MMM"),
  },
};

export const SalesNumbersCard = async ({
  timeframe,
  product,
  backHref,
  ...props
}: Props) => {
  const { unit, label } = chartBuckets[timeframe.activePeriod];
  const [stats, chartData] = await Promise.all([
    getSalesStats(timeframe.startDate, timeframe.endDate, product?.id),
    getSalesTimeseries(
      timeframe.startDate,
      timeframe.endDate,
      unit,
      product?.id,
    ),
  ]);
  const chartLabels = chartData.map(label);
  const datapoints = chartData.map((p) => p.value);

  return (
    <StatisticsCard
      title={product ? product.name : "Sales numbers"}
      className={cn("grid w-full grid-cols-3", props.className)}
    >
      {backHref && (
        <div className="col-span-full p-4 lg:p-6 lg:pb-0">
          <Link
            href={backHref}
            scroll={false}
            className="inline-flex items-center gap-1 rounded-md border-2 border-neutral-600 px-3 py-1 text-sm font-medium hover:bg-neutral-100 lg:text-base"
          >
            <HiChevronLeft aria-hidden />
            Back
          </Link>
        </div>
      )}
      <div className="col-span-full flex flex-col p-2 lg:col-span-2 lg:p-4">
        <AdminBarChart
          data={datapoints}
          labels={chartLabels}
          className="w-full max-w-md self-center pl-0 pt-3 lg:h-64 lg:pl-6 lg:pt-6"
        />
      </div>
      <div className="col-span-full flex flex-col gap-3 px-4 py-4 lg:col-span-1 lg:gap-6 lg:py-10">
        <HeadlinerStatistic
          title="Total sales"
          value={formatCurrency(stats.sum)}
        />
        <HeadlinerStatistic
          title="Average transaction"
          value={formatCurrency(stats.average)}
        />
        <HeadlinerStatistic
          title="Purchases made"
          value={stats.amount.toString()}
        />
      </div>
    </StatisticsCard>
  );
};
