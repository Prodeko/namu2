"use client";

import { range, sum } from "lodash";
import { HiArrowNarrowLeft } from "react-icons/hi";

import { IconButton } from "@/components/ui/Buttons/IconButton";
import { HistoryList } from "@/components/ui/ListItem/HistoryList";
import { PurchaseListItem } from "@/components/ui/ListItem/PurchaseListItem";
import { SectionTitle } from "@/components/ui/SectionTitle";

const PurchaseHistoryPage = () => {
  // example items
  const purchaseHistoryItems = [
    {
      name: "Choco Bar",
      price: 1.5,
      amount: 5,
      date: new Date(),
    },
    {
      name: "Sandwich",
      price: 3,
      amount: 2,
      date: new Date(),
    },
    {
      name: "Ice Cream",
      price: 2,
      amount: 4,
      date: new Date(),
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
              <PurchaseListItem key={index * idx} {...item} />
            ))}
          </HistoryList>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
