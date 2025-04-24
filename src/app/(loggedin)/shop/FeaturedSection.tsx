"use client";

import { ComponentProps, useEffect, useState } from "react";

import { getBlobUrlByName } from "@/common/blobServiceUtils";
import { formatCurrency } from "@/common/utils";
import { AddFundsDialog } from "@/components/ui/AddFundsDialog";
import Card from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCurrentUserBalance } from "@/server/actions/account/getBalance";
import { getCurrentUser } from "@/server/db/queries/account";

export const FeaturedSection = ({ ...props }: ComponentProps<"section">) => {
  const [userBalance, setUserBalance] = useState("loading...");
  const [userFirstName, setUserFirstName] = useState("...");
  useEffect(() => {
    getCurrentUserBalance().then((balance) => {
      setUserBalance(formatCurrency(balance));
    });
    getCurrentUser().then((user) => {
      if (user.ok) setUserFirstName(user.user.firstName);
    });
  });
  return (
    <section {...props} className="flex flex-col gap-8 lg:gap-4 ">
      <SectionTitle
        title={`Welcome, ${userFirstName}!`}
        className="px-5 md:px-12"
      />
      <div className="no-scrollbar flex min-w-full gap-3 overflow-x-scroll px-5 md:gap-7 md:px-12">
        <AddFundsDialog>
          <Card
            as="button"
            imgFile={getBlobUrlByName("wallet.jpg")}
            imgAltText="wallet"
            topText="Balance"
            middleText={userBalance}
            bottomText="Click to Add Funds "
          />
        </AddFundsDialog>
        <Card
          as="a"
          href="/wish"
          imgFile={getBlobUrlByName("wish.jpg")}
          imgAltText="wish"
          topText="Something missing?"
          middleText="Make a Wish!"
        />
      </div>
    </section>
  );
};
