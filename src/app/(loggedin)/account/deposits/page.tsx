import { redirect } from "next/navigation";

import { getSession } from "@/auth/ironsession";
import { formatDateTime, parseISOString } from "@/common/utils";
import { EmptyPage } from "@/components/ui/EmptyPage";
import { HistoryList, HistoryListItem } from "@/components/ui/HistoryList";
import { AccountHistoryLayout } from "@/components/ui/Layouts/AccountHistoryLayout";
import { db } from "@/server/db/prisma";

const DepositHistoryPage = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const userId = session.user.userId;
  const depositHistory = (await db.$queryRaw`
  
  SELECT 
    "Deposit"."createdAt"::date as "eventDate", 
    JSON_AGG(JSON_BUILD_OBJECT('id', "id", 'amount', "amount", 'createdAtIsoString', "createdAt")) as items
  FROM "Deposit"
  WHERE "userId" = ${userId}
  GROUP BY 1
  
  `) as {
    eventDate: Date;
    items: { id: string; amount: number; createdAtIsoString: string }[];
  }[];

  return (
    <AccountHistoryLayout title="Deposit History">
      {depositHistory.length === 0 ? (
        <EmptyPage type="deposits" />
      ) : (
        depositHistory.map((deposit) => {
          const items = deposit.items;
          return (
            <HistoryList
              eventDate={formatDateTime(deposit.eventDate)}
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
