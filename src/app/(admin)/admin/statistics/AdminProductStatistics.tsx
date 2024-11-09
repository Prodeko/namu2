import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import { getSalesDataGroupedByProduct } from "@/server/actions/stats/transactions";

export const AdminProductStatistics = async ({
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  const data = await getSalesDataGroupedByProduct();
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
