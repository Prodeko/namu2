"use client";

import { useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import {
  HiOutlinePlusCircle,
  HiShoppingCart,
  HiSparkles,
} from "react-icons/hi";

import { SidebarItem } from "./SidebarItem";

export const AdminSidebar = () => {
  const [activeTab, setActiveTab] = useState("restock");

  return (
    <div className="flex w-96 flex-none flex-col gap-0 bg-white drop-shadow-md portrait:absolute portrait:h-full">
      <SidebarItem
        text="Restock items"
        Icon={HiShoppingCart}
        href="/admin/restock"
        intent={activeTab === "restock" ? "active" : "default"}
        callback={() => setActiveTab("restock")}
      />
      <SidebarItem
        text="Add new product"
        Icon={HiOutlinePlusCircle}
        href="/admin/newProduct"
        intent={activeTab === "newProduct" ? "active" : "default"}
        callback={() => setActiveTab("newProduct")}
      />
      <SidebarItem
        text="Customer wishes"
        Icon={HiSparkles}
        href="/admin/wishes"
        intent={activeTab === "wishes" ? "active" : "default"}
        callback={() => setActiveTab("wishes")}
      />
    </div>
  );
};
