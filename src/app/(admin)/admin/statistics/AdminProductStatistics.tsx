import { ComponentPropsWithoutRef } from "react";

import { getSalesDataGroupedByProduct } from "@/server/actions/stats/transactions";
import { db } from "@/server/db/prisma";

import { ProductStatisticsPanel } from "./ProductStatisticsPanel";
import { SalesNumbersCard } from "./SalesNumbersCard";
import { StatsTimeframe } from "./page";

interface Props extends ComponentPropsWithoutRef<"div"> {
  timeframe: StatsTimeframe;
  /** The product whose sales are shown instead of the product table. */
  productId?: number;
}

export const AdminProductStatistics = async ({
  timeframe,
  productId,
  ...props
}: Props) => {
  const [data, product] = await Promise.all([
    getSalesDataGroupedByProduct(timeframe.startDate, timeframe.endDate),
    productId === undefined
      ? null
      : db.product.findUnique({
          where: { id: productId },
          select: { name: true },
        }),
  ]);

  const backParams = new URLSearchParams({
    period: timeframe.activePeriod,
    startingFrom: timeframe.startDate.getTime().toString(),
  });

  return (
    <ProductStatisticsPanel
      data={data}
      className={props.className}
      productCard={
        productId !== undefined && product ? (
          <SalesNumbersCard
            timeframe={timeframe}
            product={{ id: productId, name: product.name }}
            backHref={`?${backParams.toString()}`}
            className="col-span-full"
          />
        ) : undefined
      }
    />
  );
};
