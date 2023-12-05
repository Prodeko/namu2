import { ComponentProps } from "react";

import Card from "@/app/_components/ui/Card";
import { SectionTitle } from "@/app/_components/ui/SectionTitle";
import { type Section } from "@/common/types";

interface SectionProps extends ComponentProps<"section"> {
  section: Section;
}

export const FeaturedSection = ({ section, ...props }: SectionProps) => {
  return (
    <section id={section.id} {...props} className="flex flex-col gap-8 px-12">
      <SectionTitle title={section.name} />
      <div className="grid grid-cols-2 gap-7">
        <Card
          as="button"
          imgFile="wallet.jpg"
          imgAltText="wallet"
          topText="Balance"
          middleText="69.99€"
          bottomText="Click to Add Funds "
        />
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
