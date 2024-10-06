"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiLogout } from "react-icons/hi";
import { HiWallet } from "react-icons/hi2";
import { PiContactlessPaymentFill } from "react-icons/pi";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { LineButton } from "@/components/ui/Buttons/LineButton";
import { InfoCard } from "@/components/ui/InfoCard";
import { RfidSetupDialog } from "@/components/ui/RfidSetupDialog";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCurrentUser } from "@/server/db/queries/account";

const AccountPage = () => {
  const pathName = usePathname();
  const [nfcConnectionStatus, setNfcConnectionStatus] = useState("Checking...");
  useEffect(() => {
    const checkNfcConnection = async () => {
      const user = await getCurrentUser();
      if (user.ok) {
        setNfcConnectionStatus(
          user.user.nfcSerialHash ? "Connected" : "Disconnected",
        );
      } else {
        setNfcConnectionStatus("Disconnected");
      }
    };
    checkNfcConnection();
  }, []);
  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between bg-white py-12">
      <div className="flex flex-col gap-9">
        <SectionTitle className="px-12 " title="Account" />
        <div className="grid grid-cols-2 gap-12 px-12">
          <InfoCard title="wallet" data="0,99 €" Icon={HiWallet} />
          <InfoCard
            title="RFID"
            data={nfcConnectionStatus}
            Icon={PiContactlessPaymentFill}
          />
        </div>
        <div className="flex flex-col">
          <LineButton
            text="Change PIN code"
            buttonType="a"
            href={`${pathName}/change-pincode`}
          />
          <LineButton text="Add funds" buttonType="button" />
          <RfidSetupDialog />
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
