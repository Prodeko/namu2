import { SectionTitle } from "@/components/ui/SectionTitle";

import { ChangePinForm } from "./ChangePinForm";

const AccountPage = () => {
  return (
    <div className="flex h-full w-full flex-col justify-between gap-9 bg-white px-6 py-8 md:px-12 md:py-12">
      <SectionTitle withBackButton title="Change PIN" />
      <ChangePinForm />
    </div>
  );
};

export default AccountPage;
