"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HiOutlinePlusCircle,
  HiShoppingCart,
  HiSparkles,
} from "react-icons/hi";

import { SidebarItem } from "./SidebarItem";

const getActiveTab = () => {
  let path = usePathname();
  path = path.replace("/admin", "");
  let nextSlashIndex = path.indexOf("/");
  if (nextSlashIndex === -1) return "login";
  path = path.substring(1);
  nextSlashIndex = path.indexOf("/");
  if (nextSlashIndex === -1) return path;
  return path.substring(0, nextSlashIndex);
};

export const AdminSidebar = () => {
  const [activeTab, setActiveTab] = useState(getActiveTab());
  return (
    <div className="z-20 flex w-80 flex-none flex-col gap-0 bg-white drop-shadow-md 2xl:w-96 portrait:absolute portrait:h-full">
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
