import React, { type ComponentProps } from "react";

import { formatCurrency, formatDate, formatTime } from "@/common/utils";

type ListItemProps = ComponentProps<"li">;

export interface Props extends ListItemProps {
  timestamp: Date;
  charge: number;
}

export const DepositListItem = ({ timestamp, charge, ...props }: Props) => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};
