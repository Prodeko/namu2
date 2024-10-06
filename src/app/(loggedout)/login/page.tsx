import { HiOutlineUserAdd } from "react-icons/hi";

import { ReceiptProduct } from "@/common/types";
import { Receipt } from "@/components/Receipt";
import { BottomCard } from "@/components/ui/BottomCard";
import { CenteredTitle } from "@/components/ui/BottomCard/CenteredTitle";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { PromptText } from "@/components/ui/PromptText";
import { getReceiptItems } from "@/server/db/queries/transaction";

import { HeroSection } from "./HeroSection";
import { LoginForm } from "./LoginForm";

const Home = async (params: { searchParams: { [key: string]: string } }) => {
  let transactionItems: ReceiptProduct[] = [];
  const showReceipt = params.searchParams?.showReceipt === "true";
  if (showReceipt) {
    transactionItems = await getReceiptItems();
  }
  return (
    <>
      <HeroSection />
      <BottomCard>
        <CenteredTitle title="Login to Your Account" />
        <LoginForm />
        <div className="flex w-full items-center justify-end gap-4">
          <PromptText sizing="2xl" text="Don't have an account?" />
          <ThinButton
            buttonType="a"
            href="/newaccount"
            text="Sign up"
            RightIcon={HiOutlineUserAdd}
            intent="tertiary"
          />
        </div>
      </BottomCard>
      {showReceipt && <Receipt items={transactionItems} />}
    </>
  );
};

export default Home;
