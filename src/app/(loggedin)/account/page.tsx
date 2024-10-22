"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiLogout } from "react-icons/hi";
import { HiWallet } from "react-icons/hi2";
import { PiContactlessPaymentFill } from "react-icons/pi";

import { formatCurrency } from "@/common/utils";
import { AddFundsDialog } from "@/components/ui/AddFundsDialog";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { LineButton } from "@/components/ui/Buttons/LineButton";
import { InfoCard, InfoCardLoading } from "@/components/ui/InfoCard";
import { RfidSetupDialog } from "@/components/ui/RfidSetupDialog";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCurrentUserBalance } from "@/server/actions/account/getBalance";
import { getCurrentUser } from "@/server/db/queries/account";
import { getUserBalance } from "@/server/db/queries/transaction";

const AccountPage = () => {
  const pathName = usePathname();
  const [nfcConnectionStatus, setNfcConnectionStatus] = useState<string | null>(
    null,
  );
  const [userBalance, setUserBalance] = useState<string | null>(null);
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
    getCurrentUserBalance().then((balance) => {
      setUserBalance(formatCurrency(balance));
    });
  }, []);
  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between gap-6 bg-white py-8 md:py-12 ">
      <div className="flex flex-col gap-9">
        <SectionTitle className="px-6 md:px-12 " title="Account" />
        <div className="grid grid-cols-1 gap-6 px-6 md:grid-cols-2 md:gap-12 md:px-12 ">
          {userBalance ? (
            <InfoCard title="Balance" data={userBalance} Icon={HiWallet} />
          ) : (
            <InfoCardLoading title="Balance" Icon={HiWallet} />
          )}
          {nfcConnectionStatus ? (
            <InfoCard
              title="RFID"
              data={nfcConnectionStatus}
              Icon={PiContactlessPaymentFill}
            />
          ) : (
            <InfoCardLoading title="RFID" Icon={PiContactlessPaymentFill} />
          )}
        </div>
        <div className="flex flex-col">
          <LineButton
            text="Change PIN code"
            buttonType="a"
            href={`${pathName}/change-pincode`}
          />
          <AddFundsDialog>
            <LineButton text="Add funds" buttonType="button" />
          </AddFundsDialog>

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

      <div className="px-6 md:px-12">
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
