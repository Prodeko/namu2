"use client";

import { sum } from "lodash";

import { HistoryList } from "@/components/ui/HistoryList";
import { PurchaseListItem } from "@/components/ui/HistoryList/PurchaseListItem";
import { AccountHistoryLayout } from "@/components/ui/Layouts/AccountHistoryLayout";

const PurchaseHistoryPage = () => {
  const purchaseHistory = [
    [
      {
        id: 1,
        name: "Choco Bar",
        price: 1.5,
        amount: 5,
        date: new Date(),
      },
      {
        id: 2,
        name: "Sandwich",
        price: 3,
        amount: 2,
        date: new Date(),
      },
      {
        id: 3,
        name: "Ice Cream",
        price: 2,
        amount: 4,
        date: new Date(),
      },
    ],
    [
      {
        id: 4,
        name: "Choco Bar",
        price: 1.5,
        amount: 5,
        date: new Date(),
      },
      {
        id: 5,
        name: "Sandwich",
        price: 3,
        amount: 2,
        date: new Date(),
      },
      {
        id: 6,
        name: "Ice Cream",
        price: 2,
        amount: 4,
        date: new Date(),
      },
    ],
    [
      {
        id: 7,
        name: "Choco Bar",
        price: 1.5,
        amount: 5,
        date: new Date(),
      },
      {
        id: 8,
        name: "Sandwich",
        price: 3,
        amount: 2,
        date: new Date(),
      },
      {
        id: 9,
        name: "Ice Cream",
        price: 2,
        amount: 4,
        date: new Date(),
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
            <PurchaseListItem key={item.id} {...item} />
          ))}
        </HistoryList>
      ))}
    </AccountHistoryLayout>
  );
};

export default PurchaseHistoryPage;
