import { formatCurrency } from "@/common/utils";

export interface Props {
  name: string;
  price: number;
  amount: number;
}

export const PurchaseListItem = ({ name, price, amount }: Props) => {
  return (
    <div className="flex justify-between gap-3 text-xl font-medium">
      <div className="flex gap-1 text-neutral-800">
        <span>{amount}</span>
        <span>x</span>
        <span>{name}</span>
      </div>
      <div className="flex w-max gap-1">
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
};
