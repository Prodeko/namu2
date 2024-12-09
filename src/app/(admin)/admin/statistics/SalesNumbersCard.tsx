import { format, getWeek } from "date-fns";
import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import {
  TimeseriesDatapoint,
  getTransactionStats,
  getTransactionStatsByDay,
  getTransactionStatsByHour,
  getTransactionStatsByMonth,
  getTransactionStatsByWeek,
} from "@/server/actions/stats/transactions";

import { HeadlinerStatistic } from "./HeadlinerStatistic";
import { StatisticsCard } from "./StatisticsCard";
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
    <StatisticsCard title="Sales numbers" className="grid w-full grid-cols-3">
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
    </StatisticsCard>
  );
};
