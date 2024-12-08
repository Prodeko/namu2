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
import { ComponentPropsWithoutRef } from "react";
import { Bar, } from "react-chartjs-2";

import { barShadowPlugin } from "@/common/chartjs-plugins";
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
  barShadowPlugin,
);
interface Props extends ComponentPropsWithoutRef<"div"> {
  data: number[];
  labels: string[];
}

const options = {
  //   animation: false,
  responsive: true,
  devicePixelRatio: 2,
  plugins: {
    legend: {
      display: false,
    },
    customBarShadow: true,
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        maxTicksLimit: 5,
      },
    },
  },
};

export const AdminBarChart = ({ data, labels, ...props }: Props) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: "rgb(228, 121, 179)",
        hoverOffset: 4,
        //barThickness: 60,
      },
    ],
  };
  return (
    <div className={cn("relative ", props.className)}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
