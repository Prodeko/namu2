"use client";

import { HiOutlineSave, HiX } from "react-icons/hi";

import { FatButton } from "@/components/ui/Buttons/FatButton";
import { CustomerWishes } from "@/components/ui/CustomerWishes";
import { EditProductForm } from "@/components/ui/EditProductForm";

const WishAdmin = () => {
  return (
    <div className="flex w-full max-w-screen-md flex-col gap-8">
      <h2 className="text-5xl font-semibold text-neutral-700">
        Customer wishes
        {/* TODO: component */}
      </h2>
      <CustomerWishes />
    </div>
  );
};

export default WishAdmin;
