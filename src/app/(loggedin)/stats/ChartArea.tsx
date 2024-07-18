"use client";

import { useState } from "react";
import colors from "tailwindcss/colors";

import { ChartDataset } from "@/common/types";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { RadioInput } from "@/components/ui/RadioInput";
import { StatsChart } from "@/components/ui/StatsChart";
import { useQuery } from "@tanstack/react-query";

const testLabels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];
const testDatasets = [
  {
    label: "# of Products",
    data: [12, 19, 3, 5, 2, 3],
    backgroundColor: colors.pink[400],
    borderColor: colors.pink[400],
    borderWidth: 2,
  } as ChartDataset,
];

const chartTypes = ["Bar", "Line"] as const;
export type ChartType = (typeof chartTypes)[number];

const availableStats = ["My purchases", "My spending"] as const;
type AvailableStat = (typeof availableStats)[number];

export const ChartArea = () => {
  const [chartType, setChartType] = useState<ChartType>("Bar");
  const [stat, setStat] = useState<AvailableStat>("My purchases");
  return (
    <>
      <div className="grid w-full grid-cols-3 gap-6">
        <DropdownSelect
          labelText="Stat type"
          value={stat}
          onValueChange={setStat}
          choices={availableStats}
          className="flex-1"
        />
        <DropdownSelect
          labelText="Product"
          placeholder="Select..."
          choices={["All", "Pepsi", "Coca Cola", "Sprite"]}
          className="flex-1"
        />
        <RadioInput
          labelText="Chart type"
          options={chartTypes}
          className="self-center"
          onChange={(value: string) =>
            setChartType(value.toLowerCase() as ChartType)
          }
          style="rounded"
        />
      </div>
      <StatsChart
        labels={testLabels}
        datasets={testDatasets}
        type={chartType}
      />
    </>
  );
};
