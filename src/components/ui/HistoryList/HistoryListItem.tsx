import type { ComponentPropsWithoutRef } from "react";

import { formatCleverDateTime, formatCurrency } from "@/common/utils";

interface BaseProps extends ComponentPropsWithoutRef<"div"> {
  amount: number;
}

interface PurchaseProps extends BaseProps {
  type: "purchase";
  name: string;
  price: number;
}

interface DepositProps extends BaseProps {
  type: "deposit";
  timestamp: Date;
}

type Props = PurchaseProps | DepositProps;

export const HistoryListItem = (props: Props) => {
  if (props.type === "purchase") {
    const { type, amount, name, price, ...restProps } = props;
    return (
      <div
        {...restProps}
        className="flex justify-between gap-3 text-xl font-medium"
      >
        <div className="flex gap-1 text-neutral-800">
          <span>{amount}</span>
          <span>x</span>
          <span>{name}</span>
        </div>
        <div className="flex gap-1">
          <span className="text-neutral-800">{amount}</span>
          <span className="text-neutral-800">x</span>
          <span className="text-primary-500">{formatCurrency(price)}</span>
          <span className="text-neutral-800">=</span>
          <span className="text-primary-400">
            {formatCurrency(amount * price)}
          </span>
        </div>
      </div>
    );
  }

  const { type, amount, timestamp, ...restProps } = props;
  return (
    <div
      {...restProps}
      className="flex justify-between gap-3 text-xl font-medium"
    >
      <div className="flex gap-1 text-neutral-800">
        <span>{formatCleverDateTime(timestamp)}</span>
      </div>
      <div className="flex gap-1">
        <span className="text-primary-400">{formatCurrency(amount)}</span>
      </div>
    </div>
  );
};
