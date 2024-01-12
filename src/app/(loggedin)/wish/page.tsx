"use client";

import { HiSparkles } from "react-icons/hi2";

import { type WishObject } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { TabViewSelector } from "@/components/ui/TabViewSelector";
import { WishItem } from "@/components/ui/WishItem";
import { type TabKey, activeTab, tabs } from "@/state/tabs";
import { useSignals } from "@preact/signals-react/runtime";

const wishlist: WishObject[] = [
  {
    id: 1,
    name: "Jaffakeksit",
    wishDate: new Date("2023-11-08"),
    voteCount: 40,
    closed: false,
  },
  {
    id: 2,
    name: "Pepsikeksit",
    wishDate: new Date("2023-12-05"),
    voteCount: 3,
    closed: false,
  },
  {
    id: 3,
    name: "Kokiskeksit",
    wishDate: new Date("2023-11-11"),
    voteCount: 100,
    closed: true,
  },
  {
    id: 4,
    name: "Kokiskeksit",
    wishDate: new Date("2023-11-11"),
    voteCount: 100,
    closed: true,
  },
  {
    id: 5,
    name: "Kokiskeksit",
    wishDate: new Date("2023-11-11"),
    voteCount: 100,
    closed: true,
  },
  {
    id: 6,
    name: "Kokiskeksit",
    wishDate: new Date("2023-11-11"),
    voteCount: 100,
    closed: true,
  },
  {
    id: 7,
    name: "Kokiskeksit",
    wishDate: new Date("2023-11-11"),
    voteCount: 100,
    closed: true,
  },
  {
    id: 8,
    name: "Kokiskeksit",
    wishDate: new Date("2023-11-11"),
    voteCount: 100,
    closed: true,
  },
];

const Wish = () => {
  useSignals();
  const filterWishList = (wishlist: WishObject[], tabkey: TabKey) => {
    const tab = tabs[tabkey];
    return tab.filterMethod(wishlist);
  };

  return (
    <div className="flex min-h-0 w-full max-w-screen-lg flex-1 flex-col gap-4 bg-white px-12 py-8 pt-6">
      <TabViewSelector />
      <div className="no-scrollbar inline-block flex-1 overflow-y-auto">
        {filterWishList(wishlist, activeTab.value).map((item) => (
          <WishItem
            id={item.id.toString()}
            name={item.name}
            wishDate={item.wishDate}
            voteCount={item.voteCount}
            voted={false}
            key={item.id}
          />
        ))}
      </div>

      <div className="flex flex-none flex-col">
        <FatButton
          buttonType="a"
          href="/wish/new"
          text="Make a wish"
          intent="primary"
          RightIcon={HiSparkles}
        />
      </div>
    </div>
  );
};

export default Wish;
