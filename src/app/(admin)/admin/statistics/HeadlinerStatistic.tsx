import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"div"> {
  title: string;
  value: string;
}

export const HeadlinerStatistic = ({ title, value, ...props }: Props) => {
  return (
    <div className="flex flex-col gap-1 ">
      <p className="text-md font-medium ">{title}</p>
      <p className="text-3xl font-bold text-primary-400">{value}</p>
    </div>
  );
};
