import { type ComponentProps } from "react";
import { type IconType } from "react-icons";

import * as AspectRatio from "@radix-ui/react-aspect-ratio";

interface Props extends ComponentProps<"div"> {
  title: string;
  data: string;
  Icon: IconType;
}

export const InfoCard = ({ title, data, Icon, ...props }: Props) => {
  return (
    <AspectRatio.Root
      ratio={16 / 9}
      className="flex min-w-full flex-col gap-2 rounded-xl border-[3px] border-primary-400 bg-primary-50 p-8"
    >
      <div className="flex h-min w-full justify-between gap-2">
        <span className="text-2xl capitalize text-primary-400">{title}</span>
        <Icon className="text-primary-500" size={36} />
      </div>
      <span className="text-5xl font-bold text-primary-500">{data}</span>
    </AspectRatio.Root>
  );
};
