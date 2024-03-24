"use client";

import { range, sum } from "lodash";
import { HiArrowNarrowLeft } from "react-icons/hi";

import { IconButton } from "@/components/ui/Buttons/IconButton";
import { DepositListItem } from "@/components/ui/ListItem/DepositListItem";
import { HistoryList } from "@/components/ui/ListItem/HistoryList";
import { SectionTitle } from "@/components/ui/SectionTitle";

const DepositHistoryPage = () => {
  // example items
  const depositHistory = [
    { timestamp: new Date(), charge: 10 },
    { timestamp: new Date(), charge: 10 },
    { timestamp: new Date(), charge: 10 },
  ];

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between bg-white py-12">
      <SectionTitle
        withBackButton
        title="Deposit History"
        className="px-12 align-middle"
      />
      <div className="flex flex-col">
        {range(0, 9).map((idx) => (
          <HistoryList
            eventDate="Today 22:03"
            totalPrice={sum(depositHistory.map((x) => x.charge))}
            key={idx}
          >
            {depositHistory.map((item) => (
              <DepositListItem key={idx * 10} {...item} />
            ))}
          </HistoryList>
        ))}
      </div>
    </div>
  );
};

export default DepositHistoryPage;
