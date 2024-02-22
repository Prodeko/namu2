import { HiArrowLeft } from "react-icons/hi2";

import { IconButton } from "@/components/ui/Buttons/IconButton";
import { SectionTitle } from "@/components/ui/SectionTitle";

import { ChangePinForm } from "./ChangePinForm";

const AccountPage = () => {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-9 bg-white p-12">
      <div className="flex items-center gap-8">
        <IconButton
          sizing="md"
          Icon={HiArrowLeft}
          buttonType="a"
          href="/account"
        />
        <SectionTitle title="Change PIN" />
      </div>
      <ChangePinForm />
    </div>
  );
};

export default AccountPage;
