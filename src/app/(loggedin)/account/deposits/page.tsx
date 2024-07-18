import { sum } from "lodash";

import { HistoryList } from "@/components/ui/HistoryList";
import { DepositListItem } from "@/components/ui/HistoryList/DepositListItem";
import { AccountHistoryLayout } from "@/components/ui/Layouts/AccountHistoryLayout";

const DepositHistoryPage = () => {
  const depositHistory = [
    [
      { timestamp: new Date(), charge: 10, id: 1 },
      { timestamp: new Date(), charge: 10, id: 2 },
      { timestamp: new Date(), charge: 10, id: 3 },
    ],
    [
      { timestamp: new Date(), charge: 20, id: 4 },
      { timestamp: new Date(), charge: 20, id: 5 },
      { timestamp: new Date(), charge: 20, id: 6 },
    ],
    [
      { timestamp: new Date(), charge: 30, id: 7 },
      { timestamp: new Date(), charge: 30, id: 8 },
      { timestamp: new Date(), charge: 30, id: 9 },
    ],
    [
      { timestamp: new Date(), charge: 40, id: 10 },
      { timestamp: new Date(), charge: 40, id: 11 },
      { timestamp: new Date(), charge: 40, id: 12 },
    ],
  ];

  return (
    <AccountHistoryLayout title="Deposit History">
      {depositHistory.map((items) => (
        <HistoryList
          eventDate="Today 22:03"
          totalPrice={sum(items.map((x) => x.charge))}
        >
          {items.map((item) => (
            <DepositListItem key={item.id} {...item} />
          ))}
        </HistoryList>
      ))}
    </AccountHistoryLayout>
  );
};

export default DepositHistoryPage;
