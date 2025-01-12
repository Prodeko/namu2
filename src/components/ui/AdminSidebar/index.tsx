"use client";

import { useState } from "react";
import { FaCrown, FaLock } from "react-icons/fa6";
import {
  HiChartBar,
  HiChevronLeft,
  HiChevronRight,
  HiOutlinePlusCircle,
  HiShoppingCart,
  HiSparkles,
} from "react-icons/hi";

import { SidebarItem } from "@/components/ui/AdminSidebar/SidebarItem";

interface Props {
  superadmin?: boolean;
}

export const AdminSidebar = ({ superadmin }: Props) => {
  return (
    <div className="z-20 flex w-full flex-none gap-0 bg-white drop-shadow-md 2xl:w-96 landscape:h-full landscape:w-80 ">
      <div className="flex w-full flex-row justify-between gap-0 landscape:flex-col landscape:justify-start">
        <SidebarItem
          text="Products"
          Icon={HiShoppingCart}
          href="/admin/edit-products"
        />
        <SidebarItem
          text="New"
          Icon={HiOutlinePlusCircle}
          href="/admin/newProduct"
        />
        <SidebarItem text="Wishes" Icon={HiSparkles} href="/admin/wishes" />
        <SidebarItem text="Stats" Icon={HiChartBar} href="/admin/statistics" />
        {superadmin && (
          <SidebarItem
            text="Superadmin"
            Icon={FaCrown}
            href="/admin/superadmin"
          />
        )}
      </div>
    </div>
  );
};
