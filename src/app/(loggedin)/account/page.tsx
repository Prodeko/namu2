"use client";

import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiLogout, HiUserCircle } from "react-icons/hi";
import { HiWallet } from "react-icons/hi2";
import { PiContactlessPaymentFill } from "react-icons/pi";

import { formatCurrency, getDeviceType } from "@/common/utils";
import { AddFundsDialog } from "@/components/ui/AddFundsDialog";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { LineButton } from "@/components/ui/Buttons/LineButton";
import { InfoCard, InfoCardLoading } from "@/components/ui/InfoCard";
import { LinkProdekoQrDialog } from "@/components/ui/LinkProdekoQrDialog";
import { RfidSetupDialog } from "@/components/ui/RfidSetupDialog";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { performLogout } from "@/lib/clientLogout";
import { getCurrentUserBalance } from "@/server/actions/account/getBalance";
import {
  beginKeycloakLink,
  getKeycloakLinkStatus,
} from "@/server/actions/auth/linkKeycloak";
import {
  getCurrentUser,
  getCurrentUserMigrationStatus,
} from "@/server/db/queries/account";
import { DeviceType } from "@prisma/client";

import { AccountMigrationDialog } from "./AccountMigrationDialog";

const AccountPage = () => {
  const pathName = usePathname();
  const [nfcConnectionStatus, setNfcConnectionStatus] = useState<string | null>(
    null,
  );
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [userMigrated, setUserMigrated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [kcStatus, setKcStatus] = useState<string | null>(null);
  const [isGuildroomTablet, setIsGuildroomTablet] = useState(false);

  const handleLogout = async () => {
    await performLogout();
  };

  const handleKeycloakLink = async () => {
    const begin = await beginKeycloakLink();
    if (!begin.ok) {
      return;
    }
    await signIn("keycloak", {
      callbackUrl: "/auth/callback?intent=link",
    });
  };

  useEffect(() => {
    setIsGuildroomTablet(getDeviceType() === DeviceType.GUILDROOM_TABLET);
  }, []);

  useEffect(() => {
    const checkNfcConnection = async () => {
      const user = await getCurrentUser();
      if (user.ok) {
        setCurrentUser(user.user.firstName);
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
    getCurrentUserMigrationStatus().then((migrated) => {
      setUserMigrated(migrated);
    });
    getKeycloakLinkStatus().then((status) => {
      setKcStatus(status.isLinked ? status.email || "Linked" : "Click to Link");
    });
  }, []);
  return (
    <div className="flex h-full w-full flex-grow flex-col justify-between gap-6 py-8 md:py-8 landscape:max-w-screen-lg ">
      <div className="flex flex-col gap-9">
        <SectionTitle
          className="px-6 md:px-12 "
          title={`Welcome, ${currentUser}!`}
        />
        <div className="grid grid-cols-1 gap-6 px-6 md:grid-cols-3 md:gap-12 md:px-12 ">
          {userBalance ? (
            <AddFundsDialog>
              <InfoCard
                cardType="div"
                title="Balance"
                data={userBalance}
                Icon={HiWallet}
              />
            </AddFundsDialog>
          ) : (
            <InfoCardLoading title="Balance" Icon={HiWallet} />
          )}
          {nfcConnectionStatus ? (
            <RfidSetupDialog>
              <InfoCard
                cardType="div"
                title="RFID"
                data={nfcConnectionStatus}
                Icon={PiContactlessPaymentFill}
              />
            </RfidSetupDialog>
          ) : (
            <InfoCardLoading title="RFID" Icon={PiContactlessPaymentFill} />
          )}
          {kcStatus ? (
            kcStatus === "Click to Link" ? (
              isGuildroomTablet ? (
                <LinkProdekoQrDialog>
                  <InfoCard
                    cardType="div"
                    title="Prodeko Account"
                    data={kcStatus}
                    Icon={HiUserCircle}
                    className="cursor-pointer hover:bg-primary-100 active:bg-primary-100"
                  />
                </LinkProdekoQrDialog>
              ) : (
                <InfoCard
                  cardType="div"
                  onClick={handleKeycloakLink}
                  title="Prodeko Account"
                  data={kcStatus}
                  Icon={HiUserCircle}
                  className="cursor-pointer hover:bg-primary-100 active:bg-primary-100"
                />
              )
            ) : (
              <InfoCard
                cardType="div"
                title="Prodeko Account"
                data={kcStatus}
                Icon={HiUserCircle}
              />
            )
          ) : (
            <InfoCardLoading title="Prodeko Account" Icon={HiUserCircle} />
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

          <RfidSetupDialog>
            <LineButton text="Connect RFID" buttonType="button" />
          </RfidSetupDialog>
          {!userMigrated && <AccountMigrationDialog />}
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
          text="logout"
          RightIcon={HiLogout}
          buttonType="button"
          intent="secondary"
          onClick={handleLogout}
          fullwidth
        />
      </div>
    </div>
  );
};

export default AccountPage;
