import Link from "next/link";
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

const Home = async (params: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  let transactionItems: ReceiptProduct[] = [];
  const receiptId = (await params.searchParams)?.receiptId || undefined;
  if (receiptId) {
    transactionItems = await getReceiptItems(receiptId);
  }
  return (
    <>
      <div className="flex h-dvh w-screen flex-col justify-between gap-0  lg:flex-row lg:items-center lg:justify-between landscape:gap-6 landscape:p-6">
        <HeroSection />
        <BottomCard>
          <CenteredTitle title="Login to Your Account" />
          <LoginForm />
          <div className="flex w-full items-center justify-end gap-2 md:gap-4">
            <PromptText sizing="2xl" text="New to Namukilke?" />
            <span className="hidden md:block">
              <ThinButton
                buttonType="a"
                href="/newaccount"
                text="Sign up"
                RightIcon={HiOutlineUserAdd}
                intent="tertiary"
              />
            </span>
            <span className="flex items-center gap-2 text-lg text-primary-400 md:hidden">
              <Link href="/newaccount">Sign up</Link>
              <HiOutlineUserAdd className="inline" />
            </span>
          </div>
        </BottomCard>
      </div>
      {receiptId && <Receipt items={transactionItems} />}
    </>
  );
};

export default Home;
