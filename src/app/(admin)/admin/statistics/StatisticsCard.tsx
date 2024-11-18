import { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const containerStyles =
  "w-full relative rounded-md divide-neutral-600 border-2 border-neutral-600 bg-white text-neutral-800 pt-10 mt-8";

interface Props extends ComponentPropsWithoutRef<"div"> {
  title: string;
  children: ReactNode;
}

export const StatisticsCard = ({ title, children, ...props }: Props) => {
  return (
    <div className={cn(props.className, containerStyles)}>
      <div className="absolute left-6 top-0 z-10 -translate-y-1/2 rounded-md border-2 border-neutral-600 bg-white px-6 py-5 text-3xl font-bold text-neutral-800  drop-shadow-[3px_3px_0px_theme(colors.neutral.700)]">
        {title}
      </div>
      {children}
    </div>
  );
};
