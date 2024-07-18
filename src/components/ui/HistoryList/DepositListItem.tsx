import { formatCurrency, formatDate, formatTime } from "@/common/utils";

export interface Props {
  timestamp: Date;
  charge: number;
}

export const DepositListItem = ({ timestamp, charge }: Props) => {
  return (
    <div className="flex justify-between gap-3 text-xl font-medium">
      <div className="flex gap-1 text-neutral-800">
        <span>{formatDate(timestamp)}</span>
        <span>{formatTime(timestamp)}</span>
      </div>
      <div className="flex w-max gap-1">
        <span className="text-primary-400">{formatCurrency(charge)}</span>
      </div>
    </div>
  );
};
