import { ReactNode } from "react";

import { formatCurrency } from "@/common/utils";

export interface Props {
  eventDate: string;
  totalPrice: number;
  children: ReactNode;
}

export const HistoryList = ({ eventDate, totalPrice, children }: Props) => {
  return (
    <div className="flex flex-col gap-4 border-b-2 py-6 md:py-8">
      <div className="flex items-center justify-between pb-3">
        <h3 className="px-6 text-2xl font-bold text-neutral-600 md:px-12 md:text-3xl">
          {eventDate}
        </h3>
        <div className="flex items-center gap-1 px-6 text-xl font-medium md:px-12 md:text-2xl">
          <span>Total:</span>
          <span className=" text-primary-500">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-6 md:px-12">{children}</div>
    </div>
  );
};
