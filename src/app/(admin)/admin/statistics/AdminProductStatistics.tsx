import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import { getSalesDataGroupedByProduct } from "@/server/actions/stats/transactions";

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
    <div className={cn("flex flex-col", props.className)}>
      <h2 className="w-full px-4 py-5 text-3xl font-bold">Product data</h2>

      <div className="flex w-full justify-between p-6 text-lg font-bold">
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
    </div>
  );
};
