"use client";

import { range, sum } from "lodash";
import { HiArrowNarrowLeft } from "react-icons/hi";

import { IconButton } from "@/components/ui/Buttons/IconButton";
import { HistoryList } from "@/components/ui/ListItem/HistoryList";
import { HistoryListItem } from "@/components/ui/ListItem/HistoryListItem";
import { SectionTitle } from "@/components/ui/SectionTitle";

const PurchaseHistoryPage = () => {
  // example items
  const purchaseHistoryItems = [
    { name: "Kokis", price: 1, amount: 10, date: new Date(), type: "purchase" },
    {
      name: "Choco Bar",
      price: 1.5,
      amount: 5,
      date: new Date(),
      type: "purchase",
    },
    { name: "Soda", price: 0.8, amount: 3, date: new Date(), type: "purchase" },
    {
      name: "Sandwich",
      price: 3,
      amount: 2,
      date: new Date(),
      type: "purchase",
    },
    {
      name: "Ice Cream",
      price: 2,
      amount: 4,
      date: new Date(),
      type: "purchase",
    },
  ];

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between bg-white py-12">
      <div className="flex h-fit w-full px-12">
        <IconButton buttonType="button" sizing="sm" Icon={HiArrowNarrowLeft} />
        <SectionTitle title="Purchase History" className="px-12 align-middle" />
      </div>
      <div className="flex flex-col">
        {range(0, 9).map((idx) => (
          <HistoryList
            eventDate="Today 22:03"
            totalPrice={sum(
              purchaseHistoryItems.map((x) => x.price * x.amount),
            )}
            key={idx}
          >
            {purchaseHistoryItems.map((item, index) => (
              <HistoryListItem key={index * idx} {...item} />
            ))}
          </HistoryList>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
