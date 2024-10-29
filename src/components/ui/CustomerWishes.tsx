"use client";

import { useState } from "react";

import { UserWishObject, WishObject } from "@/common/types";
import { TabKey, activeTab, tabs } from "@/state/tabs";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { TabViewSelector } from "./TabViewSelector";
import { WishItem } from "./WishItem";

interface Props {
  admin?: boolean;
  initialWishlist: UserWishObject[];
}

export const CustomerWishes = ({ admin = false, initialWishlist }: Props) => {
  const [wishlist, setWishlist] = useState<UserWishObject[]>(initialWishlist);
  const [parent] = useAutoAnimate<HTMLDivElement>({ duration: 200 });

  const handleLike = (updatedWish: UserWishObject) => {
    setWishlist((prev) => {
      return prev.map((wish) => {
        if (wish.id === updatedWish.id)
          return {
            ...wish,
            voteCount: updatedWish.voteCount,
            userLikesWish: !wish.userLikesWish,
          };
        return wish;
      });
    });
  };

  const filterWishList = (wishlist: WishObject[], tabkey: TabKey) => {
    const tab = tabs[tabkey];
    return tab.filterMethod(wishlist);
  };

  return (
    <div className="">
      <TabViewSelector />

      <div
        className="no-scrollbar inline-block w-full flex-1 overflow-y-scroll"
        ref={parent}
      >
        {filterWishList(wishlist, activeTab.value).map((item) => (
          <WishItem
            wish={item}
            key={item.id}
            admin={admin ? "on" : "off"}
            onLike={handleLike}
          />
        ))}
      </div>
    </div>
  );
};
