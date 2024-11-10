import { format, getWeek } from "date-fns";
import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import {
  TimeseriesDatapoint,
  getTransactionStats,
  getTransactionStatsByDay,
  getTransactionStatsByHour,
  getTransactionStatsByMonth,
  getTransactionStatsByWeek,
} from "@/server/actions/stats/transactions";

import { HeadlinerStatistic } from "./HeadlinerStatistic";
import { AdminBarChart } from "./charts/AdminBarChart";
import { StatsPeriod, StatsTimeframe } from "./page";

interface Props extends ComponentPropsWithoutRef<"div"> {
  timeframe: StatsTimeframe;
}

export type ChartDataGetter = {
  dataGetter: (start: Date, end: Date) => Promise<TimeseriesDatapoint[]>;
  labelGetter: (point: TimeseriesDatapoint) => string;
};

const getData: Record<StatsPeriod, ChartDataGetter> = {
  daily: {
    dataGetter: getTransactionStatsByHour,
    labelGetter: (d: TimeseriesDatapoint) => format(d.date, "HH:mm"),
  },
  weekly: {
    dataGetter: getTransactionStatsByDay,
    labelGetter: (d: TimeseriesDatapoint) => format(d.date, "EEEE"),
  },
  monthly: {
    dataGetter: getTransactionStatsByWeek,
    labelGetter: (d: TimeseriesDatapoint) => `Week ${getWeek(d.date)}`,
  },
  yearly: {
    dataGetter: getTransactionStatsByMonth,
    labelGetter: (d: TimeseriesDatapoint) => format(d.date, "MMM"),
  },
};

export const SalesNumbersCard = async ({ timeframe, ...props }: Props) => {
  const transactionStats = await getTransactionStats(
    timeframe.startDate,
    timeframe.endDate,
  );
  const chartDataGetter = getData[timeframe.activePeriod];
  const chartData = await chartDataGetter.dataGetter(
    timeframe.startDate,
    timeframe.endDate,
  );
  const chartLabels = chartData.map(chartDataGetter.labelGetter);
  const datapoints = chartData.map((p) => p.value);

  return (
    <div className={cn(" grid grid-cols-3", props.className)}>
      <h2 className="col-span-3 px-4 py-5 text-3xl font-bold">Sales numbers</h2>

      <div className="col-span-2 flex flex-col p-4">
        <AdminBarChart
          data={datapoints}
          labels={chartLabels}
          className="h-64 w-full self-center pl-6 pt-6"
        />
      </div>
      <div className="flex flex-col gap-6 px-4 py-10">
        <HeadlinerStatistic
          title="Total sales"
          value={formatCurrency(transactionStats.sum)}
        />
        <HeadlinerStatistic
          title="Average transaction"
          value={formatCurrency(transactionStats.average)}
        />
        <HeadlinerStatistic
          title="Purchases made"
          value={transactionStats.amount.toString()}
        />
      </div>
    </div>
  );
};
