import { formatCurrency, formatDate, formatTime } from "@/common/utils";

interface PurchaseProps {
  type: "purchase";
  name: string;
  price: number;
  amount: number;
  id: number;
}

interface DepositProps {
  type: "deposit";
  timestamp: Date;
  amount: number;
  id: number;
}

type Props = PurchaseProps | DepositProps;

export const HistoryListItem = (props: Props) => {
  return (
    <div className="flex justify-between gap-3 text-xl font-medium">
      <div className="flex gap-1 text-neutral-800">
        {props.type === "deposit" ? (
          <>
            <span>{formatDate(props.timestamp)}</span>
            <span>{formatTime(props.timestamp)}</span>
          </>
        ) : (
          <>
            <span>{props.amount}</span>
            <span>x</span>
            <span>{props.name}</span>
          </>
        )}
      </div>
      <div className="flex gap-1">
        {props.type === "deposit" ? (
          <span className="text-primary-400">
            {formatCurrency(props.amount)}
          </span>
        ) : (
          <>
            <span className="text-neutral-800">{props.amount}</span>
            <span className="text-neutral-800">x</span>
            <span className="text-primary-500">
              {formatCurrency(props.price)}
            </span>
            <span className="text-neutral-800">=</span>
            <span className="text-primary-400">
              {formatCurrency(props.amount * props.price)}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
