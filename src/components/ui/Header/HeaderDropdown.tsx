"use client";

import { useState } from "react";
import { IconType } from "react-icons";
import { FiMenu } from "react-icons/fi";
import { HiCog, HiHome, HiOutlineLogout } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";

import { IconButton } from "@/components/ui/Buttons/IconButton";
import { performLogout } from "@/lib/clientLogout";
import { type Role } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { DropdownItem } from "./DropdownItem";

type MenuItem = {
  text: string;
  href?: string;
  Icon: IconType;
  onClick?: () => void;
};

const defaultMenuItems: MenuItem[] = [
  { text: "Home", href: "/shop", Icon: HiHome },
  { text: "Wish", href: "/wish", Icon: HiSparkles },
  { text: "Settings", href: "/account", Icon: HiCog },
];

interface HeaderDropdownProps {
  role?: Role;
  menuItems?: MenuItem[];
}

export const HeaderDropdown = ({ role, menuItems }: HeaderDropdownProps) => {
  const items = menuItems || defaultMenuItems;
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
        {items.map((item) => (
          <DropdownMenu.Item
            onClick={() => {
              item.onClick?.();
              closeDropdown();
            }}
            key={item.text}
          >
            {item.href ? (
              <DropdownItem
                buttonType="a"
                href={item.href}
                text={item.text}
                Icon={item.Icon}
              />
            ) : (
              <DropdownItem
                buttonType="button"
                text={item.text}
                Icon={item.Icon}
              />
            )}
            <DropdownMenu.Separator className="h-[1px] bg-neutral-200" />
          </DropdownMenu.Item>
        ))}
        {!menuItems && (role === "ADMIN" || role === "SUPERADMIN") && (
          <>
            <DropdownMenu.Item onClick={closeDropdown} key="admin-panel">
              <DropdownItem
                buttonType="a"
                href="/admin/edit-products"
                text="Admin Panel"
                Icon={HiCog}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="h-[1px] bg-neutral-200" />
          </>
        )}
        {!menuItems && (
          <DropdownMenu.Item onClick={() => performLogout()}>
            <DropdownItem
              buttonType="button"
              text="Logout"
              Icon={HiOutlineLogout}
            />
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
