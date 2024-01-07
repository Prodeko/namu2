"use client";

import { usePathname } from "next/navigation";
import { type ComponentProps } from "react";
import { HiLogout, HiShoppingCart } from "react-icons/hi";
import { HiWallet } from "react-icons/hi2";

import { headerID } from "@/common/constants";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { IconButton } from "@/components/ui/Buttons/IconButton";
import { Logo } from "@/components/ui/Logo";

type HeaderProps = ComponentProps<"header">;

type Props = HeaderProps;

export const LoggedinHeader = ({ ...props }: Props) => {
  const pathName = usePathname();
  return (
    <header
      {...props}
      id={headerID}
      className="flex h-36 items-center justify-between bg-primary-200 px-12"
    >
      <Logo href="/shop" />
      <nav className="flex gap-6" {...props}>
        {pathName === "/shop" && (
          <>
            <FatButton
              buttonType="button"
              intent={"secondary"}
              text="Wallet"
              RightIcon={HiWallet}
            />
            <IconButton buttonType="button" sizing="md" Icon={HiShoppingCart} />
          </>
        )}
        <IconButton buttonType="a" href="/" sizing="md" Icon={HiLogout} />
      </nav>
    </header>
  );
};
