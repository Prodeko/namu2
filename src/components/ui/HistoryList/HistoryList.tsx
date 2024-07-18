import { ReactNode } from "react";

import { formatCurrency } from "@/common/utils";

export interface Props {
  eventDate: string;
  totalPrice: number;
  children: ReactNode;
}

export const HistoryList = ({ eventDate, totalPrice, children }: Props) => {
  return (
    <div className="flex flex-col gap-4 border-b-2 py-8">
      <div className="flex items-center justify-between pb-3">
        <h3 className="px-12 text-3xl font-bold text-neutral-600">
          {eventDate}
        </h3>
        <div className="flex items-center gap-1 px-12 text-2xl font-medium">
          <span>Total:</span>
          <span className=" text-primary-500">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-12">{children}</div>
    </div>
  );
};
