"use client";

import { ComponentPropsWithoutRef, useMemo, useState } from "react";
import { HiChevronDown, HiChevronLeft, HiChevronUp } from "react-icons/hi";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import type { SalesData } from "@/server/actions/stats/transactions";
import { useQuery } from "@tanstack/react-query";

import { HeadlinerStatistic } from "./HeadlinerStatistic";
import { StatisticsCard } from "./StatisticsCard";
import { getProductSalesChart } from "./actions";
import { periodBucketUnit } from "./chartLabels";
import { AdminBarChart } from "./charts/AdminBarChart";
import type { StatsTimeframe } from "./page";

type SortKey = "productName" | "totalQuantitySold" | "totalSales";
type SortDirection = "asc" | "desc";
type Sort = { key: SortKey; direction: SortDirection };

interface Props extends ComponentPropsWithoutRef<"div"> {
  data: SalesData[];
  timeframe: StatsTimeframe;
}

const compareProducts = (a: SalesData, b: SalesData, sort: Sort): number => {
  const byName = a.productName.localeCompare(b.productName, "fi");
  const primary =
    sort.key === "productName" ? byName : a[sort.key] - b[sort.key];
  if (primary === 0) return byName; // Tie-break on name is always ascending.
  return sort.direction === "asc" ? primary : -primary;
};

const columns: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "productName", label: "Product name", align: "left" },
  { key: "totalQuantitySold", label: "Quantity sold", align: "left" },
  { key: "totalSales", label: "Total sales", align: "right" },
];

const gridStyles = "grid w-full grid-cols-3 gap-4";

export const ProductStatisticsPanel = ({
  data,
  timeframe,
  ...props
}: Props) => {
  const [sort, setSort] = useState<Sort>({
    key: "totalSales",
    direction: "desc",
  });
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: number;
    productName: string;
  } | null>(null);

  const sortedData = useMemo(
    () => [...data].sort((a, b) => compareProducts(a, b, sort)),
    [data, sort],
  );

  const handleSortClick = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "desc" ? "asc" : "desc" }
        : { key, direction: "desc" },
    );
  };

  const startMs = timeframe.startDate.getTime();
  const endMs = timeframe.endDate.getTime();
  const period = timeframe.activePeriod;
  const selectedId = selectedProduct?.productId;

  const chartQuery = useQuery({
    queryKey: ["productSalesChart", selectedId, startMs, endMs, period],
    queryFn: () =>
      getProductSalesChart(selectedId as number, startMs, endMs, period),
    enabled: selectedId !== undefined,
  });

  const cardClassName = cn("flex flex-col divide-y-2", props.className);

  if (selectedProduct) {
    // Derive totals from the fresh data so they follow timeframe changes.
    const productRow = data.find(
      (p) => p.productId === selectedProduct.productId,
    );
    const totalSales = productRow?.totalSales ?? 0;
    const transactionCount = productRow?.transactionCount ?? 0;
    const bucketCount = chartQuery.data?.values.length ?? 0;
    const averagePerBucket = bucketCount > 0 ? totalSales / bucketCount : 0;

    return (
      <StatisticsCard title="Product data" className={cardClassName}>
        <div
          className="flex items-center gap-3 p-4 lg:p-6"
          style={{ borderTop: "none" }}
        >
          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            className="flex items-center gap-1 rounded-md border-2 border-neutral-600 px-3 py-1 text-sm font-medium hover:bg-neutral-100 lg:text-base"
          >
            <HiChevronLeft aria-hidden />
            Back
          </button>
          <p className="text-lg font-bold lg:text-2xl">
            {selectedProduct.productName}
          </p>
        </div>
        <div className="flex flex-col p-2 lg:p-4">
          {chartQuery.isError ? (
            <p className="p-4 text-sm text-red-600">
              Could not load the sales chart.
            </p>
          ) : chartQuery.data ? (
            <AdminBarChart
              data={chartQuery.data.values}
              labels={chartQuery.data.labels}
              className="w-full max-w-2xl self-center pl-0 pt-3 lg:pl-6 lg:pt-6"
            />
          ) : (
            <p className="flex h-48 items-center justify-center text-sm text-neutral-600 lg:h-64">
              Loading…
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:gap-6 lg:p-6">
          <HeadlinerStatistic
            title="Total sales"
            value={formatCurrency(totalSales)}
          />
          <HeadlinerStatistic
            title={`Average per ${periodBucketUnit[period]}`}
            value={formatCurrency(averagePerBucket)}
          />
          <HeadlinerStatistic
            title="Purchases made"
            value={transactionCount.toString()}
          />
        </div>
      </StatisticsCard>
    );
  }

  return (
    <StatisticsCard title="Product data" className={cardClassName}>
      <div
        role="row"
        className={cn(gridStyles, "p-4 text-sm font-bold lg:p-6 lg:text-lg")}
        style={{ borderTop: "none" }}
      >
        {columns.map((column) => {
          const active = sort.key === column.key;
          return (
            <div
              key={column.key}
              role="columnheader"
              aria-sort={
                active
                  ? sort.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
              className={column.align === "right" ? "text-right" : "text-left"}
            >
              <button
                type="button"
                onClick={() => handleSortClick(column.key)}
                className={cn(
                  "inline-flex items-center gap-1 font-bold",
                  column.align === "right" ? "flex-row-reverse" : "flex-row",
                )}
              >
                {column.label}
                {active &&
                  (sort.direction === "desc" ? (
                    <HiChevronDown aria-hidden />
                  ) : (
                    <HiChevronUp aria-hidden />
                  ))}
              </button>
            </div>
          );
        })}
      </div>
      {sortedData.map((product) => (
        <button
          type="button"
          key={product.productId}
          onClick={() =>
            setSelectedProduct({
              productId: product.productId,
              productName: product.productName,
            })
          }
          className={cn(
            gridStyles,
            "px-4 py-4 text-left text-sm text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 lg:py-6 lg:text-base",
          )}
        >
          <p className="text-left">{product.productName}</p>
          <p className="text-left">{product.totalQuantitySold}</p>
          <p className="text-right">{formatCurrency(product.totalSales)}</p>
        </button>
      ))}
    </StatisticsCard>
  );
};
