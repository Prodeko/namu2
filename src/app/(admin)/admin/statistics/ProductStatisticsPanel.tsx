"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ComponentPropsWithoutRef, ReactNode, useMemo, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import type { SalesData } from "@/server/actions/stats/transactions";

import { StatisticsCard } from "./StatisticsCard";

type SortKey = "productName" | "totalQuantitySold" | "totalSales";
type SortDirection = "asc" | "desc";
type Sort = { key: SortKey; direction: SortDirection };

interface Props extends ComponentPropsWithoutRef<"div"> {
  data: SalesData[];
  /** When given, this is shown instead of the table (the product view). */
  productCard?: ReactNode;
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
  productCard,
  ...props
}: Props) => {
  const [sort, setSort] = useState<Sort>({
    key: "totalSales",
    direction: "desc",
  });
  const searchParams = useSearchParams();

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

  const productHref = (productId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("product", productId.toString());
    return `?${params.toString()}`;
  };

  if (productCard) {
    return productCard;
  }

  const cardClassName = cn("flex flex-col divide-y-2", props.className);

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
        <Link
          key={product.productId}
          href={productHref(product.productId)}
          scroll={false}
          className={cn(
            gridStyles,
            "px-4 py-4 text-left text-sm text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 lg:py-6 lg:text-base",
          )}
        >
          <p className="text-left">{product.productName}</p>
          <p className="text-left">{product.totalQuantitySold}</p>
          <p className="text-right">{formatCurrency(product.totalSales)}</p>
        </Link>
      ))}
    </StatisticsCard>
  );
};
