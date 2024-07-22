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
        "flex w-1/3 min-w-full flex-1 flex-col gap-2 rounded-xl border-[3px] border-primary-400 bg-primary-50 px-8 py-6",
        props.className,
      )}
    >
      <div className="flex h-min w-full justify-between gap-2">
        <span className="text-nowrap text-2xl capitalize text-primary-400">
          {title}
        </span>
        <Icon className="text-primary-400" size={36} />
      </div>
      <span className="truncate text-4xl font-bold tracking-tight text-primary-500">
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
