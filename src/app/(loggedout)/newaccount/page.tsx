import { BottomCard } from "@/components/ui/BottomCard";
import { CenteredTitle } from "@/components/ui/BottomCard/CenteredTitle";

import { CreateAccountForm } from "./CreateAccountForm";

const Shop = () => {
  return (
    <BottomCard>
      <CenteredTitle title="Create a new account" />
      <CreateAccountForm />
    </BottomCard>
  );
};

export default Shop;
