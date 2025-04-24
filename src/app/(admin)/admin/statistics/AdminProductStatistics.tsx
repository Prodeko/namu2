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
        className="grid grid-cols-3 gap-4 p-4 text-sm font-bold lg:p-6 lg:text-lg"
        style={{ borderTop: "none" }}
      >
        <p className="text-left">Product name</p>
        <p className="text-left">Quantity sold</p>
        <p className="text-right">Total sales</p>
      </div>
      {data.map((product) => (
        <div
          key={product.productId}
          className="grid grid-cols-3 gap-4 px-4 py-4 text-sm text-neutral-600 lg:py-6 lg:text-base"
        >
          <p className="text-left">{product.productName}</p>
          <p className="text-left">{product.totalQuantitySold}</p>
          <p className="text-right">{formatCurrency(product.totalSales)}</p>
        </div>
      ))}
    </StatisticsCard>
  );
};
