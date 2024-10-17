"use client";

import { usePathname } from "next/navigation";
import { type ComponentProps } from "react";
import { HiWallet } from "react-icons/hi2";

import { headerID } from "@/common/constants";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { Logo } from "@/components/ui/Logo";

import { HeaderDropdown } from "./HeaderDropdown";

type HeaderProps = ComponentProps<"header">;

type Props = HeaderProps;

export const LoggedinHeader = ({ ...props }: Props) => {
  const pathName = usePathname();
  return (
    <header
      {...props}
      id={headerID}
      className="flex items-center justify-between bg-primary-200 px-6 py-3 md:px-12 md:py-8"
    >
      <Logo href="/shop" />
      <nav className="flex gap-6" {...props}>
        {pathName === "/shop" && (
          <>
            <FatButton
              buttonType="button"
              intent={"header"}
              text="Wallet"
              RightIcon={HiWallet}
              className="hidden md:block"
            />
          </>
        )}
        <HeaderDropdown />
      </nav>
    </header>
  );
};
