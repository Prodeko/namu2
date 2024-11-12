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

const Statistics = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const activePeriod = (await searchParams).period as StatsPeriod;
  const startingFrom = (await searchParams).startingFrom as string;
  const startDate = startingFrom
    ? parseDateFromString(startingFrom)
    : new Date(Date.now() - 24 * 60 * 60 * 1000);
  const endDate = getEndDate(startDate, activePeriod);
  const timeframe = { startDate, endDate, activePeriod } as StatsTimeframe;

  return (
    <div className="no-scrollbar grid h-fit w-full grid-cols-3 gap-10 overflow-y-scroll px-0 pb-12 lg:w-[80%]">
      <AdminStatsNavigator activePeriod={activePeriod} startDate={startDate} />
      <div className="col-span-2 flex flex-col gap-10 self-start">
        <Suspense fallback={<p> Loading stats...</p>}>
          <SalesNumbersCard
            timeframe={timeframe}
            className={cn("w-full", containerStyles)}
          />
          <DepositNumbersCard
            timeframe={timeframe}
            className={cn("w-full", containerStyles)}
          />
        </Suspense>
      </div>
      <Suspense fallback={<p> Loading key figures...</p>}>
        <KeyNumbers
          className={cn("col-span-1 flex flex-col", containerStyles)}
        />
      </Suspense>
      <Suspense fallback={<p> Loading product stats...</p>}>
        <AdminProductStatistics
          timeframe={timeframe}
          className={cn("col-span-full", containerStyles)}
        />
      </Suspense>
    </div>
  );
};

export default Statistics;
