import { ComponentPropsWithoutRef } from "react";

import { getSalesDataGroupedByProduct } from "@/server/actions/stats/transactions";

import { ProductStatisticsPanel } from "./ProductStatisticsPanel";
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
    <ProductStatisticsPanel
      data={data}
      timeframe={timeframe}
      className={props.className}
    />
  );
};
