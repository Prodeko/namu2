"use client";

import { useState } from "react";
import { HiCurrencyDollar, HiStar } from "react-icons/hi";
import colors from "tailwindcss/colors";

import { ChartDataset } from "@/common/types";
import Card from "@/components/ui/Card";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { InfoCard } from "@/components/ui/InfoCard";
import { RadioInput } from "@/components/ui/RadioInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatsChart } from "@/components/ui/StatsChart";

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

type ChartType = "bar" | "line";

const StatsPage = () => {
  const [chartType, setChartType] = useState<ChartType>("bar");

  return (
    <div className="flex h-full w-full flex-grow flex-col gap-8 bg-neutral-50  py-12">
      <SectionTitle withBackButton className=" px-8" title="Stats dashboard" />
      <div className=" flex w-full gap-4 px-8">
        <Card
          imgFile="pepsi.jpg"
          imgAltText="Pepsi"
          middleText="Pepsi"
          topText="Product of the month"
          as="button"
          className=" flex-1"
        />
        <div className="flex flex-1 flex-col gap-4">
          <InfoCard
            title="Total purchases"
            data="1000"
            Icon={HiCurrencyDollar}
          />
          <InfoCard title="Favorite product" data="Pepsi" Icon={HiStar} />
        </div>
      </div>
      <div className="flex w-full gap-4 px-8">
        <DropdownSelect
          labelText="Stat type"
          placeholder="Select..."
          choices={["Product sales", "My purchases", "My spending"]}
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
          options={["Bar", "Line"]}
          className="max-w-[50%] self-center"
          onChange={(value) => setChartType(value.toLowerCase() as ChartType)}
          style="rounded"
        />
      </div>
      <StatsChart
        labels={testLabels}
        datasets={testDatasets}
        type={chartType}
        className=" rounded-xl  px-8"
      />
    </div>
  );
};

export default StatsPage;
