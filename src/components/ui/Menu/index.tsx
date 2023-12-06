"use client";

import { Fragment } from "react";
import { HiOutlineCog, HiOutlineLogout } from "react-icons/hi";

import { Menu as HUIMenu, type MenuProps, Transition } from "@headlessui/react";

import { MenuItem } from "./MenuItem";

interface Props extends MenuProps<"div"> {
  initials: string;
}

export const Menu = ({ initials, ...props }: Props) => {
  return (
    <HUIMenu as="div" className={"relative"} {...props}>
      <HUIMenu.Button
        className={
          "text-primary-500 flex h-16 w-16 items-center justify-center rounded-[50%] bg-white text-2xl font-bold uppercase drop-shadow-md"
        }
      >
        {initials}
      </HUIMenu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HUIMenu.Items
          className={
            "bg-primary-50 absolute right-0 z-20 mt-2 divide-y-2 rounded-md"
          }
          as="div"
        >
          <MenuItem Icon={HiOutlineCog} text="settings" />
          <MenuItem Icon={HiOutlineLogout} text="logout" />
        </HUIMenu.Items>
      </Transition>
    </HUIMenu>
  );
};
