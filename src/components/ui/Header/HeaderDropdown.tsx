"use client";

import { useState } from "react";
import { IconType } from "react-icons";
import { FiMenu } from "react-icons/fi";
import { HiChartBar, HiCog, HiHome, HiOutlineLogout } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";

import { IconButton } from "@/components/ui/Buttons/IconButton";
import { logoutAction } from "@/server/actions/auth/logout";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { DropdownItem } from "./DropdownItem";

type MenuItem = {
  text: string;
  href: string;
  Icon: IconType;
};

const menuItems = [
  { text: "Home", href: "/shop", Icon: HiHome },
  { text: "Wish", href: "/wish", Icon: HiSparkles },
  { text: "Cart", href: "/cart", Icon: HiChartBar },
  { text: "Settings", href: "/settings", Icon: HiCog },
  { text: "Logout", href: "/logout", Icon: HiOutlineLogout },
];

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
        className="z-20 rounded-lg border-2 border-neutral-100 bg-neutral-50 shadow-lg "
      >
        {menuItems.map((item) => (
          <>
            <DropdownMenu.Item onClick={closeDropdown}>
              <DropdownItem
                buttonType="a"
                href={item.href}
                text={item.text}
                Icon={item.Icon}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="h-[1px] bg-neutral-200" />
          </>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
