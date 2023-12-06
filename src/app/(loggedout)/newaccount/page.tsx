import { HiLockClosed, HiUserAdd } from "react-icons/hi";

import { BottomCard } from "@/components/ui/BottomCard";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

const Shop = () => {
  return (
    <main className="bg-primary-200 flex min-h-screen flex-col justify-between">
      <Header
        LeftComponent={<Logo />}
        RightComponent={
          <ThinButton
            buttonType="button"
            text="Admin"
            intent="secondary"
            RightIcon={HiLockClosed}
          />
        }
      />
      <BottomCard>
        <h2 className="text-4xl font-bold text-neutral-700">
          Create a New Account
        </h2>
        <div className="flex w-full flex-col gap-5 py-1">
          <Input labelText="First name" placeholderText="Matti" />
          <Input labelText="Last name" placeholderText="Meikäläinen" />
          <Input labelText="Username" placeholderText="matti.meikäläinen" />
          <Input
            labelText="New PIN (minimum 4 digits)"
            placeholderText="1234"
          />
          <Input labelText="Retype the PIN" placeholderText="1234" />
        </div>
        <FatButton
          buttonType="a"
          href="/shop"
          text="Create account"
          intent="primary"
          RightIcon={HiUserAdd}
          fullwidth
        />
      </BottomCard>
    </main>
  );
};

export default Shop;
