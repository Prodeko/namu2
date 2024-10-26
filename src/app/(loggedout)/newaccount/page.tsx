import { BottomCard } from "@/components/ui/BottomCard";
import { CenteredTitle } from "@/components/ui/BottomCard/CenteredTitle";

import { HeroSection } from "../login/HeroSection";
import { CreateAccountForm } from "./CreateAccountForm";

const Shop = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] landscape:justify-between landscape:gap-6 landscape:p-6">
      <span className="hidden w-full lg:block">
        <HeroSection />
      </span>
      <BottomCard>
        <CenteredTitle title="Create a new account" />
        <CreateAccountForm />
      </BottomCard>
    </div>
  );
};

export default Shop;
