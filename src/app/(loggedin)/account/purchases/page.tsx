import { redirect } from "next/navigation";

import { getSession } from "@/auth/ironsession";
import { formatCleverDateTime } from "@/common/utils";
import { EmptyPage } from "@/components/ui/EmptyPage";
import { HistoryList, HistoryListItem } from "@/components/ui/HistoryList";
import { AccountHistoryLayout } from "@/components/ui/Layouts/AccountHistoryLayout";
import { getUserTransactionsWithItems } from "@/server/db/utils/transaction";

const PurchaseHistoryPage = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const purchaseHistory = await getUserTransactionsWithItems(
    session.user.userId,
  );

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
