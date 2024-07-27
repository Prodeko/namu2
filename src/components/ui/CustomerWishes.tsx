"use client";

import { useState } from "react";

import { WishObject } from "@/common/types";
import { TabKey, activeTab, tabs } from "@/state/tabs";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { TabViewSelector } from "./TabViewSelector";
import { WishItem } from "./WishItem";

interface Props {
  admin?: boolean;
  initialWishlist: WishObject[];
}

export const CustomerWishes = ({ admin = false, initialWishlist }: Props) => {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 200 });

  const handleLike = (updatedWish: WishObject) => {
    setWishlist((prev) => {
      return prev.map((wish) => {
        if (wish.id === updatedWish.id) return updatedWish;
        return wish;
      });
    });
  };

  const filterWishList = (wishlist: WishObject[], tabkey: TabKey) => {
    const tab = tabs[tabkey];
    return tab.filterMethod(wishlist);
  };

  return (
    <>
      <TabViewSelector />

      <div
        className="no-scrollbar inline-block flex-1 overflow-y-scroll "
        ref={parent}
      >
        {filterWishList(wishlist, activeTab.value).map((item) => (
          <WishItem
            wish={item}
            key={item.id}
            admin={admin}
            onLike={handleLike}
          />
        ))}
      </div>
    </>
  );
};
