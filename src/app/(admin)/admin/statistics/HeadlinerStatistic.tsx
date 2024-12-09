import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"div"> {
  title: string;
  value: string;
}

export const HeadlinerStatistic = ({ title, value, ...props }: Props) => {
  return (
    <div className="flex w-full flex-row items-end justify-between gap-1 landscape:flex-col landscape:items-start landscape:justify-start">
      <p className="landscape:text-md text-sm font-medium ">{title}</p>
      <p className="text-xl font-bold text-primary-400 lg:text-3xl">{value}</p>
    </div>
  );
};
