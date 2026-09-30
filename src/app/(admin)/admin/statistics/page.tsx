import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  setDefaultOptions,
} from "date-fns";
import { Suspense } from "react";

import { cn } from "@/lib/utils";

import { AdminProductStatistics } from "./AdminProductStatistics";
import { AdminStatsNavigator } from "./AdminStatsNavigator";
import { DepositNumbersCard } from "./DepositNumbersCard";
import { KeyNumbers } from "./KeyNumbers";
import { SalesNumbersCard } from "./SalesNumbersCard";

setDefaultOptions({
  weekStartsOn: 1,
});

const containerStyles =
  "w-full rounded-md divide-y-2 divide-neutral-600 border-2 border-neutral-600 bg-white text-neutral-800";

export type StatsPeriod = "daily" | "weekly" | "monthly" | "yearly";
export type StatsTimeframe = {
  startDate: Date;
  endDate: Date;
  activePeriod: StatsPeriod;
};

const parseDateFromString = (milliseconds: string): Date => {
  const ms = parseInt(milliseconds);
  if (!Number.isNaN(ms)) return new Date(ms);
  return new Date();
};

const getEndDate = (startDate: Date, period: StatsPeriod): Date => {
  switch (period) {
    case "daily":
      return endOfDay(startDate);
    case "weekly":
      return endOfWeek(startDate);
    case "monthly":
      return endOfMonth(startDate);
    case "yearly":
      return endOfYear(startDate);
  }
};

const parseProductId = (value: string | string[] | undefined) => {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
};

const Statistics = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const activePeriod = ((await searchParams).period || "daily") as StatsPeriod;
  const startingFrom = (await searchParams).startingFrom as string;
  const startDate = startingFrom
    ? parseDateFromString(startingFrom)
    : new Date(Date.now() - 24 * 60 * 60 * 1000);
  const endDate = getEndDate(startDate, activePeriod);
  const productId = parseProductId((await searchParams).product);
  const timeframe = { startDate, endDate, activePeriod } as StatsTimeframe;

  return (
    <div className="no-scrollbar grid h-fit w-full grid-cols-3 gap-10 overflow-y-scroll px-4 pb-12 lg:w-[80%] ">
      <AdminStatsNavigator
        activePeriod={activePeriod}
        startDate={startDate}
        productId={productId}
      />
      <div className="col-span-full flex flex-col gap-10 self-start lg:col-span-2">
        <Suspense fallback={<p> Loading stats...</p>}>
          <SalesNumbersCard timeframe={timeframe} />
          <DepositNumbersCard timeframe={timeframe} />
        </Suspense>
      </div>
      <Suspense fallback={<p> Loading key figures...</p>}>
        <KeyNumbers
          className={cn("col-span-full mt-8 lg:col-span-1 ", containerStyles)}
        />
      </Suspense>
      <Suspense fallback={<p> Loading product stats...</p>}>
        <AdminProductStatistics
          timeframe={timeframe}
          productId={productId}
          className="col-span-full"
        />
      </Suspense>
    </div>
  );
};

export default Statistics;
