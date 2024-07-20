"use client";

import {
  HiOutlinePlusCircle,
  HiShoppingCart,
  HiSparkles,
} from "react-icons/hi";

import { SidebarItem } from "@/components/ui/AdminSidebar/SidebarItem";

export const AdminSidebar = () => {
  return (
    <div className="z-20 flex w-80 flex-none flex-col gap-0 bg-white drop-shadow-md 2xl:w-96 portrait:absolute portrait:h-full">
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
    </div>
  );
};
