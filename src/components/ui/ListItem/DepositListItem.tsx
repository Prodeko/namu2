import { Fragment } from "react";

import { formatCurrency, formatDate, formatTime } from "@/common/utils";

export interface Props {
  timestamp: Date;
  charge: number;
}

export const DepositListItem = ({ timestamp, charge }: Props) => {
  return (
    <Fragment>
      <span className="text-right text-xl font-medium text-neutral-800">
        {formatDate(timestamp)}
      </span>
      <span className="text-right text-xl font-medium text-neutral-800">
        {formatTime(timestamp)}
      </span>
      <span />
      <span />
      <span />
      <span />
      <span />
      <span className="text-right text-xl font-medium text-primary-400">
        {formatCurrency(charge)}
      </span>
    </Fragment>
  );
};
