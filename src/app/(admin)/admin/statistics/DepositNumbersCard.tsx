import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import { getDepostitData } from "@/server/actions/stats/deposits";
import { getTransactionStats } from "@/server/actions/stats/transactions";

import { HeadlinerStatistic } from "./HeadlinerStatistic";
import { AdminBarChart } from "./charts/AdminBarChart";
import { StatsTimeframe } from "./page";

interface Props extends ComponentPropsWithoutRef<"div"> {
  timeframe: StatsTimeframe;
}

export const DepositNumbersCard = async ({ timeframe, ...props }: Props) => {
  const depositStats = await getDepostitData(
    timeframe.startDate,
    timeframe.endDate,
  );
  return (
    <div className={cn(" grid grid-cols-3", props.className)}>
      <h2 className="col-span-3 px-4 py-5 text-3xl font-bold">Deposits</h2>

      <div className="col-span-2 flex flex-col p-4">
        <AdminBarChart
          data={[65, 123, 54, 15, 27]}
          labels={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
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
