import { format, getWeek } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import {
  getDepositData,
  getDepositStatsByDay,
  getDepositStatsByHour,
  getDepositStatsByMonth,
  getDepositStatsByWeek,
} from "@/server/actions/stats/deposits";
import { TimeseriesDatapoint } from "@/server/actions/stats/transactions";

import { HeadlinerStatistic } from "./HeadlinerStatistic";
import { ChartDataGetter } from "./SalesNumbersCard";
import { StatisticsCard } from "./StatisticsCard";
import { AdminBarChart } from "./charts/AdminBarChart";
import { StatsPeriod, StatsTimeframe } from "./page";

interface Props extends ComponentPropsWithoutRef<"div"> {
  timeframe: StatsTimeframe;
}

const getData: Record<StatsPeriod, ChartDataGetter> = {
  daily: {
    dataGetter: getDepositStatsByHour,
    labelGetter: (d: TimeseriesDatapoint) =>
      formatInTimeZone(d.date, "Europe/Helsinki", "HH:mm"),
  },
  weekly: {
    dataGetter: getDepositStatsByDay,
    labelGetter: (d: TimeseriesDatapoint) =>
      formatInTimeZone(d.date, "Europe/Helsinki", "EEEE"),
  },
  monthly: {
    dataGetter: getDepositStatsByWeek,
    labelGetter: (d: TimeseriesDatapoint) => `Week ${getWeek(d.date)}`,
  },
  yearly: {
    dataGetter: getDepositStatsByMonth,
    labelGetter: (d: TimeseriesDatapoint) =>
      formatInTimeZone(d.date, "Europe/Helsinki", "MMM"),
  },
};

export const DepositNumbersCard = async ({ timeframe, ...props }: Props) => {
  const depositStats = await getDepositData(
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
    <StatisticsCard title="Deposits" className="grid w-full grid-cols-3">
      <div className="col-span-full flex flex-col p-2 lg:col-span-2 lg:p-4">
        <AdminBarChart
          data={datapoints}
          labels={chartLabels}
          className="w-full max-w-md self-center pl-0 pt-3 lg:h-64 lg:pl-6 lg:pt-6"
        />
      </div>
      <div className="col-span-full flex flex-col gap-3 px-4 py-4 lg:col-span-1 lg:gap-6 lg:py-10">
        <HeadlinerStatistic
          title="Sum of deposits"
          value={formatCurrency(depositStats.sum)}
        />
        <HeadlinerStatistic
          title="Average deposit"
          value={formatCurrency(depositStats.average)}
        />
        <HeadlinerStatistic
          title="Deposits made"
          value={depositStats.amount.toString()}
        />
      </div>
    </StatisticsCard>
  );
};
