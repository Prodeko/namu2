import { format, getWeek } from "date-fns";
import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import {
  getDepositStatsByDay,
  getDepositStatsByHour,
  getDepositStatsByMonth,
  getDepositStatsByWeek,
  getDepostitData,
} from "@/server/actions/stats/deposits";
import {
  TimeseriesDatapoint,
  getTransactionStats,
} from "@/server/actions/stats/transactions";

import { HeadlinerStatistic } from "./HeadlinerStatistic";
import { ChartDataGetter } from "./SalesNumbersCard";
import { AdminBarChart } from "./charts/AdminBarChart";
import { StatsPeriod, StatsTimeframe } from "./page";

interface Props extends ComponentPropsWithoutRef<"div"> {
  timeframe: StatsTimeframe;
}

const getData: Record<StatsPeriod, ChartDataGetter> = {
  daily: {
    dataGetter: getDepositStatsByHour,
    labelGetter: (d: TimeseriesDatapoint) => format(d.date, "HH:mm"),
  },
  weekly: {
    dataGetter: getDepositStatsByDay,
    labelGetter: (d: TimeseriesDatapoint) => format(d.date, "EEEE"),
  },
  monthly: {
    dataGetter: getDepositStatsByWeek,
    labelGetter: (d: TimeseriesDatapoint) => `Week ${getWeek(d.date)}`,
  },
  yearly: {
    dataGetter: getDepositStatsByMonth,
    labelGetter: (d: TimeseriesDatapoint) => format(d.date, "MMM"),
  },
};

export const DepositNumbersCard = async ({ timeframe, ...props }: Props) => {
  const depositStats = await getDepostitData(
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
      <h2 className="col-span-3 px-4 py-5 text-3xl font-bold">Deposits</h2>

      <div className="col-span-2 flex flex-col p-4">
        <AdminBarChart
          data={datapoints}
          labels={chartLabels}
          className="h-64 w-full self-center pl-6 pt-6"
        />
      </div>
      <div className="flex flex-col gap-6 px-4 py-10">
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
    </div>
  );
};
