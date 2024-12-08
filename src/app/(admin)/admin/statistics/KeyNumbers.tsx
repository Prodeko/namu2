import { ComponentPropsWithoutRef } from "react";

import { formatCurrency } from "@/common/utils";
import { PieChart } from "@/components/ui/PieChart";
import { getActiveBalanceSum } from "@/server/actions/stats/balances";
import { getDepositData } from "@/server/actions/stats/deposits";
import {
  getLegacyUserCount,
  getMigratedUserCount,
  getUserCount,
} from "@/server/actions/stats/users";
import { getWishCountByStatus } from "@/server/actions/stats/wish";

import { KeyNumbersHeadliner } from "./KeyNumbersHeadliner";
import { KeyNumbersSection } from "./KeyNumbersSection";

export const KeyNumbers = async ({
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  const legacyUserCount = await getLegacyUserCount();
  const migratedUserCount = await getMigratedUserCount();
  const nonMigratedUserCount = legacyUserCount - migratedUserCount;
  const wishStats = await getWishCountByStatus();
  return (
    <div {...props}>
      <p className="px-4 py-6 text-lg font-bold">Key figures</p>
      <KeyNumbersSection
        title="Users"
        keys={["Total users", "Total legacy users", "Legacy users migrated"]}
        valueGetters={[getUserCount, getLegacyUserCount, getMigratedUserCount]}
      />
      <KeyNumbersHeadliner
        title="User balance total"
        value={formatCurrency(await getActiveBalanceSum())}
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
      <KeyNumbersHeadliner
        title="Average transaction amount"
        value="AVG amount"
      />
      <div className="grid grid-cols-2 gap-2 p-4">
        <div className="text-left">
          <p className=" pb-2 font-bold">Account migration</p>
          <p>
            Out of <span className="font-bold">{legacyUserCount}</span> legacy
            users, a total of{" "}
            <span className="font-bold">{migratedUserCount}</span> have migrated
          </p>
        </div>
        <div className="text-right">
          <PieChart
            data={[migratedUserCount, nonMigratedUserCount]}
            labels={["Migrated users", "Non-migrated users"]}
            className="h-24 justify-self-center"
          />
        </div>
      </div>
      <p className="px-4 py-4">d</p>
      <p className="px-4 py-4">e</p>
    </div>
  );
};
