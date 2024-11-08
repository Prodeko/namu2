import { cva } from "class-variance-authority";
import { Suspense } from "react";

import { AdminTitle } from "@/components/ui/AdminTitle";
import { cn } from "@/lib/utils";

import { AdminProductStatistics } from "./AdminProductStatistics";
import { DepositNumbersCard } from "./DepositNumbersCard";
import { KeyNumbers } from "./KeyNumbers";
import { SalesNumbersCard } from "./SalesNumbersCard";
import { StatisticsList } from "./StatisticsList";

const containerStyles =
  "w-full rounded-md divide-y-2 divide-neutral-600 border-2 border-neutral-600 bg-white text-neutral-800";

const Statistics = () => {
  return (
    <div className="no-scrollbar grid h-fit w-full grid-cols-3 gap-10 overflow-y-scroll px-0 pb-12 lg:w-[80%]">
      <AdminTitle title="Statistics" className="col-span-full " />
      <div className="col-span-2 flex flex-col gap-10 self-start">
        <Suspense fallback={<p> Loading stats...</p>}>
          <SalesNumbersCard className={cn("w-full", containerStyles)} />
          <DepositNumbersCard className={cn("w-full", containerStyles)} />
        </Suspense>
      </div>
      <Suspense fallback={<p> Loading key figures...</p>}>
        <KeyNumbers
          className={cn("col-span-1 flex flex-col", containerStyles)}
        />
      </Suspense>
      <AdminProductStatistics
        className={cn("col-span-full", containerStyles)}
      />
    </div>
  );
};

export default Statistics;
