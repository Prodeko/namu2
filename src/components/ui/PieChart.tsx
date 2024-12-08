"use client";

import { ArcElement, Chart as ChartJS, Tooltip } from "chart.js";
import { ComponentPropsWithoutRef } from "react";
import { Doughnut, } from "react-chartjs-2";

import { cn } from "@/lib/utils";

interface Props extends ComponentPropsWithoutRef<"div"> {
  data: number[];
  labels: string[];
}

ChartJS.register(ArcElement, Tooltip);

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

export const PieChart = ({ data, labels, ...props }: Props) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgb(228, 121, 179)",
          "rgb(244, 209, 231)",
          "rgb(218, 85, 151)",
          "rgb(141, 55, 98)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className={cn("relative w-fit", props.className)}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
