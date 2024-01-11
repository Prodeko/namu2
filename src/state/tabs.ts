import { WishObject, WishlistFilter } from "@/common/types";
import { signal } from "@preact/signals-react";

export const tabs = {
  popular: {
    tabname: "Popular",
    filterMethod: (wishlist: WishObject[]) => {
      return wishlist
        .filter((item) => !item.closed)
        .sort((a, b) => b.voteCount - a.voteCount);
    },
  },
  recent: {
    tabname: "Recent",
    filterMethod: (wishlist: WishObject[]) => {
      return wishlist
        .filter((item) => !item.closed)
        .sort((a, b) => b.wishDate.valueOf() - a.wishDate.valueOf());
    },
  },
  closed: {
    tabname: "Closed",
    filterMethod: (wishlist: WishObject[]) => {
      return wishlist.filter((item) => item.closed);
    },
  },
} as const satisfies Record<string, WishlistFilter>;

export const tabKeys = Object.keys(tabs) as TabKey[];

export type Tabs = typeof tabs;
export type TabKey = keyof Tabs;

export const activeTab = signal<TabKey>("popular");
