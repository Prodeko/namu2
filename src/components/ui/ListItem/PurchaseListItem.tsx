import { Fragment } from "react";

import { formatCurrency } from "@/common/utils";

export interface Props {
  name: string;
  price: number;
  amount: number;
}

export const PurchaseListItem = ({ name, price, amount }: Props) => {
  return (
    <Fragment>
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
    </Fragment>
  );
};
