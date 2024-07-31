import { redirect } from "next/navigation";

import { getSession } from "@/auth/ironsession";
import { formatCleverDate, parseISOString } from "@/common/utils";
import { EmptyPage } from "@/components/ui/EmptyPage";
import { HistoryList, HistoryListItem } from "@/components/ui/HistoryList";
import { AccountHistoryLayout } from "@/components/ui/Layouts/AccountHistoryLayout";
import { getDepositHistory } from "@/server/db/queries/deposit";
import { InternalServerError } from "@/server/exceptions/exception";

const DepositHistoryPage = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const userId = session.user.userId;
  const depositHistoryQuery = await getDepositHistory(userId);
  if (!depositHistoryQuery.ok) {
    throw new InternalServerError({
      message: "Failed to fetch deposit history",
    });
  }
  const depositHistory = depositHistoryQuery.depositHistory;

  return (
    <AccountHistoryLayout title="Deposit History">
      {depositHistory.length === 0 ? (
        <EmptyPage type="deposits" />
      ) : (
        depositHistory.map((deposit) => {
          const items = deposit.items;
          return (
            <HistoryList
              eventDate={formatCleverDate(deposit.eventDate)}
              totalPrice={deposit.items.reduce(
                (acc, item) => acc + item.amount,
                0,
              )}
              key={deposit.eventDate.toString()}
            >
              {items.map((item) => (
                <HistoryListItem
                  type="deposit"
                  key={item.id}
                  amount={item.amount}
                  timestamp={parseISOString(item.createdAtIsoString)}
                />
              ))}
            </HistoryList>
          );
        })
      )}
    </AccountHistoryLayout>
  );
};

export default DepositHistoryPage;
