import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import { getSalesDataGroupedByProduct } from "@/server/actions/stats/transactions";

import { StatisticsCard } from "./StatisticsCard";
import { StatsTimeframe } from "./page";

interface Props extends ComponentPropsWithoutRef<"div"> {
  timeframe: StatsTimeframe;
}

export const AdminProductStatistics = async ({
  timeframe,
  ...props
}: Props) => {
  const data = await getSalesDataGroupedByProduct(
    timeframe.startDate,
    timeframe.endDate,
  );
  return (
    <StatisticsCard
      title="Product data"
      className={cn("flex flex-col divide-y-2", props.className)}
    >
      <div
        className="flex w-full justify-between p-6 text-lg font-bold"
        style={{ borderTop: "none" }}
      >
        <p>Product ID</p>
        <p>Total sales</p>
        <p>Total quantity sold</p>
        <p>Transaction count</p>
      </div>
      {data.map((product) => (
        <div
          key={product.productId}
          className="flex w-full justify-between px-4 py-6 text-neutral-600"
        >
          <p>{product.productName}</p>
          <p>{formatCurrency(product.totalSales)}</p>
          <p>{product.totalQuantitySold}</p>
          <p>{product.transactionCount}</p>
        </div>
      ))}
    </StatisticsCard>
  );
};
