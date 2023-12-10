import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { useState } from "react";
import { HiChartBar, HiCog, HiOutlineLogout } from "react-icons/hi";

import { FatButton } from "../Buttons/FatButton";
import { DropdownItem } from "./DropdownItem";

interface HeaderDropdownProps {
  isOpen: boolean;
  onClick?: () => void;
}

export const HeaderDropdown = ({ isOpen, onClick }: HeaderDropdownProps) => {
  //if (!isOpen) return null;
  return (
    <div
      className={`absolute right-[-0.75rem] top-20 z-20 flex flex-col divide-y-[2px] rounded-lg bg-neutral-50 ${
        isOpen ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300`}
      onClick={onClick}
    >
      <DropdownItem href="/account" text="Account" Icon={HiCog} />
      <DropdownItem href="/stats" text="Stats" Icon={HiChartBar} />
      <DropdownItem href="/" text="Log out" Icon={HiOutlineLogout} />
    </div>
  );
};

HeaderDropdown.defaultProps = {
  isOpen: false,
};
