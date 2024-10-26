import { type ComponentProps } from "react";
import { type IconType } from "react-icons";

import { cn } from "@/lib/utils";

interface Props extends ComponentProps<"div"> {
  title: string;
  data: string;
  Icon: IconType;
}

export const InfoCard = ({ title, data, Icon, ...props }: Props) => {
  return (
    <div
      {...props}
      className={cn(
        "flex w-1/3 min-w-full flex-1 flex-col gap-1 rounded-xl border-[2px] border-primary-400 bg-primary-50 px-6 py-4 md:gap-2 md:border-[3px] md:px-8 md:py-6",
        props.className,
      )}
    >
      <div className="flex h-min w-full justify-between gap-1 md:gap-2">
        <span className="text-nowrap text-2xl capitalize text-primary-400">
          {title}
        </span>
        <Icon className="text-3xl text-primary-400 md:text-4xl" />
      </div>
      <span className="truncate text-2xl font-bold tracking-tight text-primary-500 md:text-4xl">
        {data}
      </span>
    </div>
  );
};

export const InfoCardLoading = ({
  title,
  Icon,
  ...props
}: Omit<Props, "data">) => {
  return (
    <InfoCard
      {...props}
      className="animate-pulse"
      data={"Loading..."}
      Icon={Icon}
      title={title}
    />
  );
};
