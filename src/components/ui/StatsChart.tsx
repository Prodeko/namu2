"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { ComponentProps } from "react";
import { Bar, Line } from "react-chartjs-2";

import { ChartDataset } from "@/common/types";
import { cn } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

type DivProps = ComponentProps<"div">;
interface Props extends DivProps {
  labels: string[];
  datasets: ChartDataset[];
  type: "bar" | "line";
  className?: string;
}

export const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export const StatsChart = ({ labels, datasets, type, className }: Props) => {
  const chartData = {
    labels,
    datasets,
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {type === "bar" ? (
        <Bar data={chartData} options={options} className="w-full" />
      ) : (
        <Line data={chartData} options={options} className="w-full" />
      )}
    </div>
  );
};