import React, { type ComponentProps } from "react";

import { formatCurrency } from "@/common/utils";

type ListItemProps = ComponentProps<"li">;

export interface Props extends ListItemProps {
  name: string;
  price: number;
  amount: number;
  date: Date;
  type: "purchase" | "deposit";
}

export const HistoryListItem = ({
  name,
  price,
  amount,
  type,
  date,
  ...props
}: Props) => {
  return (
    <React.Fragment>
      <span className="text-right text-xl text-neutral-800">{amount}</span>
      <span className="text-xl text-neutral-800">x</span>
      <span className="text-xl text-neutral-800">{name}</span>
      <span className="text-right text-xl text-neutral-800">{amount}</span>
      <span className="text-left text-xl text-neutral-800">x</span>
      <span className="text-right text-xl text-primary-500">
        {formatCurrency(price)}
      </span>
      <span className="text-left text-xl text-neutral-800">=</span>
      <span className="text-right text-xl font-medium text-primary-400">
        {formatCurrency(amount * price)}
      </span>
    </React.Fragment>
  );
};
