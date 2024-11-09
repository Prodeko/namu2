import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import { getTransactionStats } from "@/server/actions/stats/transactions";

import { HeadlinerStatistic } from "./HeadlinerStatistic";
import { AdminBarChart } from "./charts/AdminBarChart";
import { StatsTimeframe } from "./page";

interface Props extends ComponentPropsWithoutRef<"div"> {
  timeframe: StatsTimeframe;
}

export const SalesNumbersCard = async ({ timeframe, ...props }: Props) => {
  const transactionStats = await getTransactionStats(
    timeframe.startDate,
    timeframe.endDate,
  );

  return (
    <div className={cn(" grid grid-cols-3", props.className)}>
      <h2 className="col-span-3 px-4 py-5 text-3xl font-bold">Sales numbers</h2>

      <div className="col-span-2 flex flex-col p-4">
        <AdminBarChart
          data={[65, 123, 54, 15, 27]}
          labels={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
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
