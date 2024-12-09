import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

import { SingleStackedBar } from "./charts/SingleStackedBar";

interface Props extends ComponentPropsWithoutRef<"div"> {
  title: string;
  data: number[];
  labels: string[];
}

export const KeyNumbersStackedBar = ({
  title,
  data,
  labels,
  ...props
}: Props) => {
  return (
    <div className={cn("flex flex-col gap-1 p-4", props.className)}>
      <p className="pb-2 text-sm font-bold lg:text-base">{title}</p>
      <SingleStackedBar data={data} labels={labels} />
    </div>
  );
};
