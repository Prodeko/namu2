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

export const AdminHeader = ({ ...props }: Props) => {
  const pathName = usePathname();
  return (
    <header
      {...props}
      id={headerID}
      className="flex flex-none items-center justify-between bg-primary-200 px-12 py-4 2xl:py-8"
    >
      <div className="flex flex-col">
        <Logo href="/admin" />
        <p className="text-lg font-medium italic text-primary-500 2xl:text-xl">
          ADMIN PANEL
        </p>
      </div>
      <nav className="flex gap-6" {...props}>
        <IconButton buttonType="a" href="/admin" sizing="sm" Icon={HiLogout} />
      </nav>
    </header>
  );
};
