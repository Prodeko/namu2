"use client";

import { useState } from "react";
import { FaCrown } from "react-icons/fa6";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePlusCircle,
  HiShoppingCart,
  HiSparkles,
} from "react-icons/hi";

import { SidebarItem } from "@/components/ui/AdminSidebar/SidebarItem";

export const AdminSidebar = () => {
  const [visible, setVisible] = useState(false);

  const ToggleButton = () => {
    return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div
        className="w-fit p-4 text-3xl text-neutral-800 md:p-6 md:text-4xl "
        onClick={() => setVisible(!visible)}
      >
        {visible ? <HiChevronLeft /> : <HiChevronRight />}
      </div>
    );
  };
  if (!visible)
    return (
      <div className="absolute bottom-0 left-0 z-20 rounded-2xl bg-white shadow-md">
        <ToggleButton />
      </div>
    );

  return (
    <div className="absolute z-20 flex h-full w-80 flex-none flex-col justify-between gap-0 bg-white drop-shadow-md 2xl:w-96">
      <div className="flex flex-col gap-0">
        <SidebarItem
          text="Restock items"
          Icon={HiShoppingCart}
          href="/admin/restock"
        />
        <SidebarItem
          text="Add new product"
          Icon={HiOutlinePlusCircle}
          href="/admin/newProduct"
        />
        <SidebarItem
          text="Customer wishes"
          Icon={HiSparkles}
          href="/admin/wishes"
        />
        <SidebarItem
          text="Superadmin"
          Icon={FaCrown}
          href="/admin/superadmin"
        />
      </div>
      <ToggleButton />
    </div>
  );
};
