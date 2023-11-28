import Card from "@/app/_components/ui/Card";
import { SectionTitle } from "@/app/_components/ui/SectionTitle";

export const FeaturedSection = () => {
  return (
    <section className="flex flex-col gap-8">
      <SectionTitle title="Featured" />
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
