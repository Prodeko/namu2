import { redirect } from "next/navigation";

import { formatCleverDateTime } from "@/common/utils";
import { EmptyPage } from "@/components/ui/EmptyPage";
import { HistoryList, HistoryListItem } from "@/components/ui/HistoryList";
import { AccountHistoryLayout } from "@/components/ui/Layouts/AccountHistoryLayout";
import { getCurrentUser } from "@/server/db/queries/account";
import { getUserTransactionsWithItems } from "@/server/db/queries/transaction";

export const dynamic = "force-dynamic";

const PurchaseHistoryPage = async () => {
  const user = await getCurrentUser();
  if (!user.ok) {
    redirect("/login");
  }
  const purchaseHistory = await getUserTransactionsWithItems(user.user.id);

  return (
    <AccountHistoryLayout title="Purchase History">
      {purchaseHistory.length === 0 ? (
        <EmptyPage type="purchases" />
      ) : (
        purchaseHistory.map((transaction) => {
          const items = transaction.TransactionItem;
          return (
            <HistoryList
              eventDate={formatCleverDateTime(transaction.createdAt)}
              totalPrice={transaction.totalPrice.toNumber()}
              key={transaction.id}
            >
              {items.map((item) => (
                <HistoryListItem
                  type="purchase"
                  key={item.productId}
                  name={item.Product.name}
                  price={item.singleItemPrice.toNumber()}
                  amount={item.quantity}
                />
              ))}
            </HistoryList>
          );
        })
      )}
    </AccountHistoryLayout>
  );
};

export default PurchaseHistoryPage;
