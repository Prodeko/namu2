import { ComponentPropsWithoutRef } from "react";

import {
  translatePrismaDepositMethod,
  translatePrismaDeviceType,
} from "@/common/enumTranslations";
import { formatCurrency } from "@/common/utils";
import { cn } from "@/lib/utils";
import { getActiveBalanceSum } from "@/server/actions/stats/balances";
import {
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

export const KeyNumbers = async ({
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  const wishStats = await getWishCountByStatus();

  const depositMethodStats = await getDepositMethodStats(
    new Date(0),
    new Date(),
  );
  const methodLabels = depositMethodStats.map((stat) =>
    translatePrismaDepositMethod(stat.depositMethod),
  );
  const methodData = depositMethodStats.map((stat) => stat.count);

  const loginDeviceStats = await getLoginDataByDeviceType(
    new Date(0),
    new Date(),
  );
  const loginDeviceLabels = loginDeviceStats.map((stat) =>
    translatePrismaDeviceType(stat.deviceType),
  );
  const loginDeviceData = loginDeviceStats.map((stat) => stat.count);

  return (
    <div className={cn("relative flex flex-col pt-8", props.className)}>
      <div className="absolute left-6 top-0 z-10 -translate-y-1/2 rounded-md border-2 border-neutral-600 bg-white px-4 py-3 text-xl font-bold text-neutral-800  drop-shadow-[3px_3px_0px_theme(colors.neutral.700)]">
        Key Figures
      </div>
      {/* Remove top border caused by divide-y with !-modifier (= CSS !important) */}
      <span className="!border-t-0">
        <KeyNumbersSection
          title="Users"
          keys={["Total users", "Total legacy users", "Legacy users migrated"]}
          valueGetters={[
            getUserCount,
            getLegacyUserCount,
            getMigratedUserCount,
          ]}
        />
      </span>
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
