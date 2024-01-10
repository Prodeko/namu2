"use client";

import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";

import { type WishObject } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WishItem } from "@/components/ui/WishItem";
import { WishNavButton } from "@/components/ui/WishNavButton";

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
  type Tabname = "voted" | "recent" | "closed";

  const [activetab, setActivetab] = useState<Tabname>("voted");

  const filterWishList = (wishlist: WishObject[], tabname: Tabname) => {
    switch (tabname) {
      case "voted":
        return wishlist
          .filter((item) => !item.closed)
          .sort((a, b) => b.voteCount - a.voteCount);
      case "recent":
        return wishlist
          .filter((item) => !item.closed)
          .sort((a, b) => b.wishDate.valueOf() - a.wishDate.valueOf());
      case "closed":
        return wishlist.filter((item) => item.closed);
      default:
        return wishlist;
    }
  };

  return (
    <div className="flex h-full flex-grow flex-col">
      <div className="relative inline-flex flex-col items-center justify-center gap-3 overflow-hidden bg-[radial-gradient(circle_at_50.00%_50.00%,rgba(249,227,239,1)_0%,rgba(236,175,208,1)_100%)] px-40 py-24">
        {/* Animated background and a pink overlay */}

        <div className="animate-infinite-scroll absolute left-0 top-0 inline-flex h-full w-max blur-md">
          <img
            src="/wish-bg-tile.png"
            alt="candies"
            className="inline-block h-full min-w-fit"
          />
          <img
            src="/wish-bg-tile.png"
            alt="candies"
            className="inline-block h-full min-w-fit"
          />
          <img
            src="/wish-bg-tile.png"
            alt="candies"
            className="inline-block h-full min-w-fit"
          />
        </div>
        <div className="absolute left-0 top-0 h-full w-full bg-pink-50 opacity-40" />

        <SectionTitle
          title="Something missing from our catalog?"
          className="z-10 text-center text-4xl font-bold text-primary-600"
        />
        <p className="z-10 inline-flex text-center text-2xl">
          Don&apos;t worry, Namu CEO is here for you! Just drop your wishes in
          the following form and you might find the product in our shelves in
          the upcoming weeks. 😎
        </p>
      </div>

      <div className="flex h-full flex-grow flex-col gap-8 bg-white px-12 py-8">
        <div className="flex justify-center">
          <WishNavButton
            name="Most voted"
            intent={activetab === "voted" ? "active" : "regular"}
            onClick={() => setActivetab("voted")}
          />
          <WishNavButton
            name="Most recent"
            intent={activetab === "recent" ? "active" : "regular"}
            onClick={() => setActivetab("recent")}
          />
          <WishNavButton
            name="Closed wishes"
            intent={activetab === "closed" ? "active" : "regular"}
            onClick={() => setActivetab("closed")}
          />
        </div>

        <div className="h-full grow overflow-y-auto">
          {filterWishList(wishlist, activetab).map((item) => (
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
    </div>
  );
};

export default Wish;
