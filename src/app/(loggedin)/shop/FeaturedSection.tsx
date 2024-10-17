"use client";

import { ComponentProps, useEffect, useState } from "react";

import { type Section } from "@/common/types";
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
      setUserBalance(`${balance}€`);
    });
  });
  return (
    <section
      ref={ref}
      id={section.id}
      {...props}
      className="flex flex-col gap-8 px-12"
    >
      <SectionTitle title={section.name} />
      <div className="grid grid-cols-2 gap-7">
        <AddFundsDialog>
          <Card
            as="button"
            imgFile="wallet.jpg"
            imgAltText="wallet"
            topText="Balance"
            middleText={userBalance}
            bottomText="Click to Add Funds "
          />
        </AddFundsDialog>
        <Card
          as="a"
          href="/wish"
          imgFile="wish.jpg"
          imgAltText="wish"
          topText="Something missing?"
          middleText="Make a Wish!"
        />
      </div>
    </section>
  );
};
