import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { HiChartBar, HiCog, HiOutlineLogout } from "react-icons/hi";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { IconButton } from "../Buttons/IconButton";
import { DropdownItem } from "./DropdownItem";

export const HeaderDropdown = () => {
  const [open, setOpen] = useState(false);

  const closeDropdown = () => setOpen(false);
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <IconButton buttonType="button" sizing="md" Icon={FiMenu} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        sideOffset={5}
        className="z-20 rounded-lg border-2 border-primary-200 bg-neutral-50 shadow-lg shadow-primary-200"
      >
        <DropdownMenu.Item onClick={closeDropdown}>
          <DropdownItem href="/account" text="Account" Icon={HiCog} />
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[1px] bg-neutral-200" />

        <DropdownMenu.Item onClick={closeDropdown}>
          <DropdownItem href="/stats" text="Stats" Icon={HiChartBar} />
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[2px] bg-neutral-200" />

        <DropdownMenu.Item onClick={closeDropdown}>
          <DropdownItem href="/" text="Log out" Icon={HiOutlineLogout} />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
