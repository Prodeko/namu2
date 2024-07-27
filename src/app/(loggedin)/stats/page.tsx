"use client";

import { useState } from "react";

import { NonEmptyArray, Timeframe } from "@/common/types";
import { RadioInput } from "@/components/ui/RadioInput";
import { SectionTitle } from "@/components/ui/SectionTitle";

import { ChartArea } from "./ChartArea";
import { FavouriteProductCard } from "./FavouriteProductCard";
import { MoneyInfoCard } from "./MoneyInfoCard";
import { TransactionsInfoCard } from "./TransactionsInfoCard";

const TimeframeHashmap: Record<string, Timeframe> = {
  Day: "day",
  Week: "week",
  Month: "month",
  All: "allTime",
};

const StatsPage = () => {
  const [timeFrame, setTimeFrame] = useState<Timeframe>("week");
  return (
    <div className="flex h-full w-full flex-grow flex-col divide-y-2 divide-neutral-200 bg-neutral-50 py-12">
      <div className="flex w-full flex-col gap-8 px-12 pb-8">
        <div className="flex justify-between gap-4">
          <SectionTitle title="Stats dashboard" />
          <RadioInput
            style="rounded"
            onChange={(value) =>
              setTimeFrame(TimeframeHashmap[value] as Timeframe)
            }
            options={
              Object.keys(TimeframeHashmap) as unknown as NonEmptyArray<string>
            }
          />
        </div>
        <div className="grid w-full grid-cols-3 gap-6">
          <FavouriteProductCard timeFrame={timeFrame} />
          <div className="flex flex-1 flex-col gap-6">
            <MoneyInfoCard timeFrame={timeFrame} />
            <TransactionsInfoCard timeFrame={timeFrame} />
          </div>
        </div>
      </div>
      <ChartArea timeFrame={timeFrame} />
    </div>
  );
};

export default StatsPage;
