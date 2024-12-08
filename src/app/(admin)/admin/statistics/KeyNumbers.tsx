import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import { PieChart } from "@/components/ui/PieChart";
import { getActiveBalanceSum } from "@/server/actions/stats/balances";
import {
  getDepositData,
  getDepositMethodStats,
} from "@/server/actions/stats/deposits";
import {
  getLegacyUserCount,
  getLoginDataByDeviceType,
  getMigratedUserCount,
  getUserCount,
} from "@/server/actions/stats/users";
import { getWishCountByStatus } from "@/server/actions/stats/wish";

import { KeyNumbersHeadliner } from "./KeyNumbersHeadliner";
import { KeyNumbersSection } from "./KeyNumbersSection";
import { KeyNumbersStackedBar } from "./KeyNumbersStackedBar";
import { SingleStackedBar } from "./charts/SingleStackedBar";

export const KeyNumbers = async ({
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  const wishStats = await getWishCountByStatus();

  const depositMethodStats = await getDepositMethodStats(
    new Date(0),
    new Date(),
  );
  const methodLabels = depositMethodStats.map((stat) => stat.depositMethod);
  const methodData = depositMethodStats.map((stat) => stat.count);

  const loginDeviceStats = await getLoginDataByDeviceType(
    new Date(0),
    new Date(),
  );
  const loginDeviceLabels = loginDeviceStats.map((stat) => stat.deviceType);
  const loginDeviceData = loginDeviceStats.map((stat) => stat.count);

  return (
    <div {...props}>
      <p className="px-4 py-6 text-lg font-bold">Key figures</p>
      <KeyNumbersSection
        title="Users"
        keys={["Total users", "Total legacy users", "Legacy users migrated"]}
        valueGetters={[getUserCount, getLegacyUserCount, getMigratedUserCount]}
      />
      <KeyNumbersStackedBar
        title="User devices"
        data={loginDeviceData}
        labels={loginDeviceLabels}
      />
      <KeyNumbersHeadliner
        title="User balance total"
        value={formatCurrency(await getActiveBalanceSum())}
      />
      <KeyNumbersStackedBar
        title="Deposit methods"
        data={methodData}
        labels={methodLabels}
      />
      <KeyNumbersSection
        title="User wishes"
        keys={["Open wishes", "Wishes completed", "Wishes rejected"]}
        valueGetters={[
          async () => wishStats.OPEN,
          async () => wishStats.ACCEPTED,
          async () => wishStats.REJECTED,
        ]}
      />

      <p className="px-4 py-4">e</p>
    </div>
  );
};
