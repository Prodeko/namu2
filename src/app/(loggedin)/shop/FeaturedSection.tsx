"use client";

import { ComponentProps, useEffect, useState } from "react";

import { getBlobUrlByName } from "@/common/blobServiceUtils";
import { type Section } from "@/common/types";
import { formatCurrency } from "@/common/utils";
import { AddFundsDialog } from "@/components/ui/AddFundsDialog";
import Card from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCurrentUserBalance } from "@/server/actions/account/getBalance";
import { useSyncActiveSection } from "@/state/useSyncActiveSection";

interface SectionProps extends ComponentProps<"section"> {
  section: Section;
}

export const FeaturedSection = ({ section, ...props }: SectionProps) => {
  const ref = useSyncActiveSection(section);
  const [userBalance, setUserBalance] = useState("loading...");
  useEffect(() => {
    getCurrentUserBalance().then((balance) => {
      setUserBalance(formatCurrency(balance));
    });
  }, []);
  return (
    <section
      ref={ref}
      id={section.id}
      {...props}
      className="flex flex-col gap-8 "
    >
      <SectionTitle title={section.name} className="px-5 md:px-12" />
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
