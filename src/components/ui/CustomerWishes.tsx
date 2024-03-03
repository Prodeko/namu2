import { WishObject } from "@/common/types";
import { TabKey, activeTab, tabs } from "@/state/tabs";

import { TabViewSelector } from "./TabViewSelector";
import { WishItem } from "./WishItem";

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

interface Props {
  admin?: boolean;
}

export const CustomerWishes = ({ admin = false }: Props) => {
  const filterWishList = (wishlist: WishObject[], tabkey: TabKey) => {
    const tab = tabs[tabkey];
    return tab.filterMethod(wishlist);
  };
  return (
    <>
      <TabViewSelector />

      <div className="no-scrollbar inline-block flex-1 overflow-y-auto">
        {filterWishList(wishlist, activeTab.value).map((item) => (
          <WishItem wish={item} voted={false} key={item.id} admin={admin} />
        ))}
      </div>
    </>
  );
};
