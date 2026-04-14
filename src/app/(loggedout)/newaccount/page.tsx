import { BottomCard } from "@/components/ui/BottomCard";
import { CenteredTitle } from "@/components/ui/BottomCard/CenteredTitle";

import { HeroSection } from "../login/HeroSection";
import { CreateAccountForm } from "./CreateAccountForm";

const Shop = async (params: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const searchParams = await params.searchParams;
  const kcData = {
    kcSub: searchParams.kcSub,
    kcEmail: searchParams.kcEmail,
    kcFirstName: searchParams.kcFirstName,
    kcLastName: searchParams.kcLastName,
  };

  return (
    <div className="flex h-dvh w-[100vw] flex-col-reverse lg:flex-row landscape:justify-between landscape:gap-6 landscape:p-6">
      <span className="hidden w-full lg:block">
        <HeroSection />
      </span>
      <BottomCard>
        <CenteredTitle title="Create a new account" />
        <CreateAccountForm kcData={kcData} />
      </BottomCard>
    </div>
  );
};

export default Shop;
