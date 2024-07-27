"use client";

import { usePathname } from "next/navigation";
import { HiLogout } from "react-icons/hi";
import { HiWallet, HiXCircle } from "react-icons/hi2";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { LineButton } from "@/components/ui/Buttons/LineButton";
import { InfoCard } from "@/components/ui/InfoCard";
import { SectionTitle } from "@/components/ui/SectionTitle";

const AccountPage = () => {
  const pathName = usePathname();
  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between bg-white py-12">
      <div className="flex flex-col gap-9">
        <SectionTitle className="px-12 " title="Account" />
        <div className="grid grid-cols-2 gap-12 px-12">
          <InfoCard title="wallet" data="0,99 €" Icon={HiWallet} />
          <InfoCard title="RFID" data="Disconnected" Icon={HiXCircle} />
        </div>
        <div className="flex flex-col">
          <LineButton
            text="Change PIN code"
            buttonType="a"
            href={`${pathName}/change-pincode`}
          />
          <LineButton text="Add funds" buttonType="button" />
          <LineButton text="Connect RFID" buttonType="button" />
          <LineButton
            text="Purchase history"
            buttonType="a"
            href={`${pathName}/purchases`}
          />
          <LineButton
            text="Deposit history"
            buttonType="a"
            href={`${pathName}/deposits`}
          />
        </div>
      </div>

      <div className="px-12">
        <FatButton
          href="/"
          text="logout"
          RightIcon={HiLogout}
          buttonType="a"
          intent="secondary"
          fullwidth
        />
      </div>
    </div>
  );
};

export default AccountPage;
