"use client";

import { ComponentProps, useEffect, useState } from "react";

import { getBlobUrlByName } from "@/common/blobServiceUtils";
import { formatCurrency } from "@/common/utils";
import Card from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { showModal } from "@/components/ui/modal";
import { AddFundsFlow } from "@/components/ui/modal/flows/AddFundsFlow";
import { cn } from "@/lib/utils";
import { getCurrentUserBalance } from "@/server/actions/account/getBalance";
import { getCurrentUser } from "@/server/db/queries/account";
import { cardCollapseMs, searchOpen } from "@/state/shopSearch";
import { useSignals } from "@preact/signals-react/runtime";

import { SearchField } from "./SearchField";
import { SearchTrigger } from "./SearchTrigger";

export const FeaturedSection = ({ ...props }: ComponentProps<"section">) => {
  useSignals();
  const [userBalance, setUserBalance] = useState("loading...");
  const [userFirstName, setUserFirstName] = useState("...");
  useEffect(() => {
    getCurrentUserBalance().then((balance) => {
      setUserBalance(formatCurrency(balance));
    });
    getCurrentUser().then((user) => {
      if (user.ok) setUserFirstName(user.user.firstName);
    });
  }, []);
  return (
    <section {...props} className="flex flex-col gap-8 lg:gap-4 ">
      <div className="flex items-center justify-between gap-4 px-5 md:px-12">
        <SectionTitle title={`Welcome, ${userFirstName}!`} />
        <SearchTrigger />
      </div>
      <SearchField />
      {/* Collapses while searching, so everything above the keyboard is results */}
      <div
        aria-hidden={searchOpen.value}
        style={{ transitionDuration: `${cardCollapseMs}ms` }}
        className={cn(
          "grid transition-all ease-out",
          searchOpen.value
            ? // The negative margin absorbs the section gap the collapsed cards leave behind
              "pointer-events-none -mt-8 grid-rows-[0fr] opacity-0 lg:-mt-4"
            : "grid-rows-[1fr] opacity-100",
        )}
      >
        <div className="overflow-hidden">
          <div className="no-scrollbar flex min-w-full gap-3 overflow-x-scroll px-5 md:gap-7 md:px-12">
            <Card
              as="button"
              imgFile={getBlobUrlByName("wallet.jpg")}
              imgAltText="wallet"
              topText="Balance"
              middleText={userBalance}
              bottomText="Click to Add Funds "
              onClick={() => void showModal(AddFundsFlow)}
            />
            <Card
              as="a"
              href="/wish"
              imgFile={getBlobUrlByName("wish.jpg")}
              imgAltText="wish"
              topText="Something missing?"
              middleText="Make a Wish!"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
