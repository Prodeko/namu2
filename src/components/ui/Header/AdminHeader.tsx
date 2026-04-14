"use client";

import { type ComponentProps } from "react";
import { HiLogout } from "react-icons/hi";

import { headerID } from "@/common/constants";
import { IconButton } from "@/components/ui/Buttons/IconButton";
import { Logo } from "@/components/ui/Logo";
import { performLogout } from "@/lib/clientLogout";

type HeaderProps = ComponentProps<"header">;

type Props = HeaderProps;

export const AdminHeader = ({ ...props }: Props) => {
  return (
    <header
      {...props}
      id={headerID}
      className="flex flex-none items-center justify-between bg-primary-200 px-6 py-3 md:px-12 2xl:py-4"
    >
      <div className="flex flex-col">
        <Logo href="/admin" />
        <p className="text-sm font-medium italic text-primary-500 2xl:text-lg">
          ADMIN PANEL
        </p>
      </div>
      <nav className="flex gap-6" {...props}>
        <IconButton
          buttonType="button"
          onClick={() => performLogout()}
          sizing="sm"
          Icon={HiLogout}
        />
      </nav>
    </header>
  );
};
