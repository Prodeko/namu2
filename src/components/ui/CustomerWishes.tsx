"use client";

import { WishObject } from "@/common/types";
import { TabKey, activeTab, tabs } from "@/state/tabs";
import { useSignals } from "@preact/signals-react/runtime";

import { TabViewSelector } from "./TabViewSelector";
import { WishItem } from "./WishItem";

interface Props {
  admin?: boolean;
  wishlist: WishObject[];
}

export const CustomerWishes = ({ admin = false, wishlist }: Props) => {
  useSignals();
  const filterWishList = (wishlist: WishObject[], tabkey: TabKey) => {
    const tab = tabs[tabkey];
    return tab.filterMethod(wishlist);
  };

  return (
    <>
      <TabViewSelector />

      <div className="no-scrollbar inline-block flex-1 overflow-y-auto ">
        {filterWishList(wishlist, activeTab.value).map((item) => (
          <WishItem wish={item} key={item.id} admin={admin} />
        ))}
      </div>
    </>
  );
};
