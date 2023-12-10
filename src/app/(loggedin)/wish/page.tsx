"use client";

import Image from "next/image";
import { useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";

import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { DropDownList } from "@/components/ui/DropDownList";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TextArea } from "@/components/ui/TextArea";
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
        .sort((a, b) => b.wish_date - a.wish_date);
      break;
    case "closed":
      items = wishlist.filter((item) => item.closed);
      break;
    default:
      items = wishlist;
  }
  return (
    <>
      <div>
        <SectionTitle
          title="Something missing from our catalog?"
          className="text-3xl font-bold"
        />
        <div className="flex w-full flex-row gap-4 text-xl">
          <p>
            Don&apos;t worry, Namu CEO is here for you! Just drop your wishes in
            the following form and you might find the product in our shelves in
            the upcoming weeks 😎
          </p>
          <Image
            src={`/${"candy.png"}`}
            alt="namuja"
            width={300}
            height={300}
          />
        </div>
      </div>
      <div className="flex flex-grow flex-col gap-5 bg-white px-28 py-20 ">
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
        {items.map((item) => (
          <WishItem
            id={item.id}
            name={item.name}
            wish_date={item.wish_date}
            vote_count={item.vote_count}
            voted={false}
          />
        ))}
      </div>
    </>
  );
};

export default Wish;
