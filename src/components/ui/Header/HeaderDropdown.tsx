"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { HiChartBar, HiCog, HiHome, HiOutlineLogout } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";

import { IconButton } from "@/components/ui/Buttons/IconButton";
import { logoutAction } from "@/server/actions/auth/logout";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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
          <DropdownItem buttonType="a" href="/shop" text="Shop" Icon={HiHome} />
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[1px] bg-neutral-200" />

        <DropdownMenu.Item onClick={closeDropdown}>
          <DropdownItem
            buttonType="a"
            href="/wish"
            text="Wish"
            Icon={HiSparkles}
          />
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[1px] bg-neutral-200" />

        <DropdownMenu.Item onClick={closeDropdown}>
          <DropdownItem
            buttonType="a"
            href="/stats"
            text="Stats"
            Icon={HiChartBar}
          />
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[1px] bg-neutral-200" />

        <DropdownMenu.Item onClick={closeDropdown}>
          <DropdownItem
            buttonType="a"
            href="/account"
            text="Account"
            Icon={HiCog}
          />
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[3px] bg-neutral-200" />

        <DropdownMenu.Item>
          <DropdownItem
            onClick={() => logoutAction()}
            buttonType="button"
            text="Log out"
            Icon={HiOutlineLogout}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
