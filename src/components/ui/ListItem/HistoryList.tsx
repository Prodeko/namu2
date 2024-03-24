import { type ComponentProps, ReactNode } from "react";

import { formatCurrency } from "@/common/utils";

type ListProps = ComponentProps<"ul">;

export interface Props extends ListProps {
  eventDate: string;
  totalPrice: number;
  children?: ReactNode;
}

export const HistoryList = ({
  eventDate,
  totalPrice,
  children,
  ...props
}: Props) => {
  return (
    <div className="border-b-2 py-8">
      <div className="flex items-center justify-between pb-3">
        <h3 className="px-12 text-3xl font-bold text-neutral-500">
          {eventDate}
        </h3>
        <div className="flex items-center px-12 text-2xl font-medium">
          <p>Total:&nbsp;</p>
          <p className=" text-primary-500">{formatCurrency(totalPrice)}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto_auto] gap-x-1 px-12">
        {children}
      </div>
    </div>
  );
};
