import { HiLogout } from "react-icons/hi";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

const AccountPage = () => {
  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between bg-white p-12">
      <SectionTitle title="Account" />
      <FatButton
        href="/"
        text="logout"
        RightIcon={HiLogout}
        buttonType="a"
        intent="secondary"
        fullwidth
      />
    </div>
  );
};

export default AccountPage;
