"use client";

import { type ComponentProps } from "react";

import { headerID } from "@/common/constants";
import { Logo } from "@/components/ui/Logo";

import { HeaderDropdown } from "./HeaderDropdown";

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
        <HeaderDropdown />
      </nav>
    </header>
  );
};
