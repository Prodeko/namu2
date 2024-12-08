import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface Props extends ComponentPropsWithoutRef<"div"> {
  data: number[];
  labels: string[];
}

export const SingleStackedBar = ({ data, labels, ...props }: Props) => {
  const totalAmount = data.reduce((acc, curr) => acc + curr, 0);
  const colorClasses = ["bg-primary-400", "bg-primary-300", "bg-primary-200"];
  const getBarWidth = (amount: number) => `${(amount / totalAmount) * 100}%`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-10 w-full" {...props}>
        {data.map((amount, index) => (
          <div
            key={index}
            className={cn(
              "group relative h-full",
              colorClasses[index % colorClasses.length],
            )}
            style={{ width: getBarWidth(amount) }}
          >
            <div className="absolute -top-full left-0 hidden whitespace-nowrap bg-neutral-100 px-2 py-1 text-sm group-hover:block">
              {labels[index]}: {amount}
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-wrap gap-4">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={cn(
                "h-4 w-4",
                colorClasses[index % colorClasses.length],
              )}
            />
            <p>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
