"use client";

import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WishItem } from "@/components/ui/WishItem";
import { WishNavButton } from "@/components/ui/WishNavButton";

const wishlist = [
  {
    id: 1,
    name: "Jaffakeksit",
    wish_date: new Date("2023-11-08"),
    vote_count: 40,
    closed: false,
  },
  {
    id: 2,
    name: "Pepsikeksit",
    wish_date: new Date("2023-12-05"),
    vote_count: 3,
    closed: false,
  },
  {
    id: 3,
    name: "Kokiskeksit",
    wish_date: new Date("2023-11-11"),
    vote_count: 100,
    closed: true,
  },
  {
    id: 4,
    name: "Kokiskeksit",
    wish_date: new Date("2023-11-11"),
    vote_count: 100,
    closed: true,
  },
  {
    id: 5,
    name: "Kokiskeksit",
    wish_date: new Date("2023-11-11"),
    vote_count: 100,
    closed: true,
  },
  {
    id: 6,
    name: "Kokiskeksit",
    wish_date: new Date("2023-11-11"),
    vote_count: 100,
    closed: true,
  },
  {
    id: 7,
    name: "Kokiskeksit",
    wish_date: new Date("2023-11-11"),
    vote_count: 100,
    closed: true,
  },
  {
    id: 8,
    name: "Kokiskeksit",
    wish_date: new Date("2023-11-11"),
    vote_count: 100,
    closed: true,
  },
];

const Wish = () => {
  type tabname = "voted" | "recent" | "closed";

  const [activetab, setActivetab] = useState<tabname>("voted");

  let items;

  switch (activetab) {
    case "voted":
      items = wishlist
        .filter((item) => !item.closed)
        .sort((a, b) => b.vote_count - a.vote_count);
      break;
    case "recent":
      items = wishlist
        .filter((item) => !item.closed)
        .sort((a, b) => b.wish_date.valueOf() - a.wish_date.valueOf());
      break;
    case "closed":
      items = wishlist.filter((item) => item.closed);
      break;
    default:
      items = wishlist;
  }
  return (
    <div className="flex h-full flex-grow flex-col">
      <div className="inline-flex flex-col items-center justify-center gap-3 bg-blue-200 px-40 py-24">
        <SectionTitle
          title="Something missing from our catalog?"
          className="text-4xl font-bold text-primary-600"
        />
        <p className="inline-flex text-center text-2xl">
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
          {items.map((item) => (
            <WishItem
              id={item.id.toString()}
              name={item.name}
              wish_date={item.wish_date}
              vote_count={item.vote_count}
              voted={false}
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
