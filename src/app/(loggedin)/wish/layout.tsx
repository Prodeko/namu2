"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { getBlobUrlByName } from "@/common/blobServiceUtils";
import { SectionTitle } from "@/components/ui/SectionTitle";

const WishLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center">
      <div className="relative flex flex-none flex-col items-center justify-center gap-3 overflow-hidden bg-[radial-gradient(circle_at_50.00%_50.00%,rgba(249,227,239,1)_0%,rgba(236,175,208,1)_100%)] px-6 py-6 md:px-24 md:py-24 lg:px-40">
        {/* Animated background and a pink overlay */}

        <div className="absolute left-0 top-0 inline-flex h-full w-max animate-infinite-scroll blur-md">
          {[1, 2, 3].map((i) => (
            <img
              key={i}
              src={getBlobUrlByName("wish-bg-tile.png")}
              alt="candies"
              className="inline-block h-full min-w-fit"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-pink-50 opacity-40" />

        <SectionTitle
          title="Something missing from our catalog?"
          className="z-10 hidden text-center text-4xl font-bold text-pink-500 drop-shadow-sm md:block md:text-8xl"
        />
        <p className="text-md z-10 inline-flex text-center text-neutral-800 md:text-2xl">
          {pathName === "/wish/new"
            ? "Don't worry, Namu CEO is here for you! Just drop your wishes in the following form and you might find the product in our shelves in the upcoming weeks. 😎"
            : "Here you can inspect new product candidates and vote for them to be added to the catalogue. You can also create your very own wish by clicking the button at the bottom!"}
        </p>
      </div>
      {children}
    </div>
  );
};

export default WishLayout;
