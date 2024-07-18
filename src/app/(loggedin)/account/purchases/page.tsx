"use client";

import { sum } from "lodash";

import { HistoryList, HistoryListItem } from "@/components/ui/HistoryList";
import { AccountHistoryLayout } from "@/components/ui/Layouts/AccountHistoryLayout";

const PurchaseHistoryPage = () => {
  const purchaseHistory = [
    [
      {
        id: 1,
        name: "Choco Bar",
        price: 1.5,
        amount: 5,
      },
      {
        id: 2,
        name: "Sandwich",
        price: 3,
        amount: 2,
      },
      {
        id: 3,
        name: "Ice Cream",
        price: 2,
        amount: 4,
      },
    ],
    [
      {
        id: 4,
        name: "Choco Bar",
        price: 1.5,
        amount: 5,
      },
      {
        id: 5,
        name: "Sandwich",
        price: 3,
        amount: 2,
      },
      {
        id: 6,
        name: "Ice Cream",
        price: 2,
        amount: 4,
      },
    ],
    [
      {
        id: 7,
        name: "Choco Bar",
        price: 1.5,
        amount: 5,
      },
      {
        id: 8,
        name: "Sandwich",
        price: 3,
        amount: 2,
      },
      {
        id: 9,
        name: "Ice Cream",
        price: 2,
        amount: 4,
      },
    ],
  ];

  return (
    <AccountHistoryLayout title="Purchase History">
      {purchaseHistory.map((items) => (
        <HistoryList
          eventDate="Today 22:03"
          totalPrice={sum(items.map((x) => x.price * x.amount))}
        >
          {items.map((item) => (
            <HistoryListItem type="purchase" key={item.id} {...item} />
          ))}
        </HistoryList>
      ))}
    </AccountHistoryLayout>
  );
};

export default PurchaseHistoryPage;
