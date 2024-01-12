"use client";

import { HiSparkles } from "react-icons/hi2";

import { type WishObject } from "@/common/types";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { CustomerWishes } from "@/components/ui/CustomerWishes";
import { PromptText } from "@/components/ui/PromptText";
import { type TabKey, tabs } from "@/state/tabs";
import { useSignals } from "@preact/signals-react/runtime";

const Wish = () => {
  useSignals();
  const filterWishList = (wishlist: WishObject[], tabkey: TabKey) => {
    const tab = tabs[tabkey];
    return tab.filterMethod(wishlist);
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-4 px-12 py-6">
      <div className="flex min-h-0 w-full max-w-screen-lg flex-1 flex-col bg-white  ">
        <CustomerWishes />
      </div>
      <div className="flex items-center gap-3 ">
        <PromptText sizing="lg" text="Something missing from our catalogue?" />
        <ThinButton
          buttonType="a"
          href="/wish/new"
          text="Create a New Wish"
          intent="tertiary"
          RightIcon={HiSparkles}
        />
      </div>
    </div>
  );
};

export default Wish;
