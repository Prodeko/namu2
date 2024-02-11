import { HiUserAdd } from "react-icons/hi";

import { BottomCard } from "@/components/ui/BottomCard";
import { CenteredTitle } from "@/components/ui/BottomCard/CenteredTitle";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { Input } from "@/components/ui/Input";

const Shop = () => {
  return (
    <BottomCard>
      <CenteredTitle title="Create a new account" />
      <div className="flex w-full flex-col gap-5 py-1">
        <Input labelText="First name" placeholderText="Matti" />
        <Input labelText="Last name" placeholderText="Meikäläinen" />
        <Input labelText="Username" placeholderText="matti.meikäläinen" />
        <Input labelText="New PIN (minimum 4 digits)" placeholderText="1234" />
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
  );
};

export default Shop;
