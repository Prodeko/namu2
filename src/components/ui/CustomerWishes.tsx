"use client";

import { WishObject } from "@/common/types";
import { TabKey, activeTab, tabs } from "@/state/tabs";

import { TabViewSelector } from "./TabViewSelector";
import { WishItem } from "./WishItem";

interface Props {
  admin?: boolean;
  wishlist: WishObject[];
}

export const CustomerWishes = ({ admin = false, wishlist }: Props) => {
  const filterWishList = (wishlist: WishObject[], tabkey: TabKey) => {
    const tab = tabs[tabkey];
    return tab.filterMethod(wishlist);
  };
  return (
    <>
      <TabViewSelector />

      <div className="no-scrollbar inline-block flex-1 overflow-y-auto ">
        {filterWishList(wishlist, activeTab.value).map((item) => (
          <WishItem wish={item} voted={false} key={item.id} admin={admin} />
        ))}
      </div>
    </>
  );
};
