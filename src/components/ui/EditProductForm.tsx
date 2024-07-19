"use client";

import { HiOutlinePlusCircle } from "react-icons/hi";

import type { ClientProduct } from "@/common/types";
import { AdminTitle } from "@/components/ui/AdminTitle";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { InputWithLabel } from "@/components/ui/Input";

interface Props {
  // Autofills the form if a product is given
  product?: ClientProduct;
}

export const EditProductForm = ({ product }: Props) => {
  return (
    <>
      <AdminTitle title={product ? "Edit product" : "Add new product"} />
      <div className="flex w-full gap-6 portrait:flex-col">
        <div className="flex flex-1 flex-col gap-4">
          <InputWithLabel
            uniqueId="edit-product-name"
            placeholderText="Coca-Cola"
            labelText="Name"
            defaultValue={product?.name}
          />
          <DropdownSelect
            labelText="Category"
            placeholder="Select a category..."
            choices={["Drink", "Snack", "Other"]}
          />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-3xl bg-white py-10 shadow-sm portrait:w-full landscape:max-w-[20rem] ">
          <HiOutlinePlusCircle className="text-6xl text-primary-400" />
          <p className="text-2xl text-neutral-700 ">Add image</p>
        </div>
      </div>
      <InputWithLabel
        uniqueId="edit-product-description"
        placeholderText="Product description"
        labelText="Description"
        defaultValue={product?.description}
      />
      <InputWithLabel
        uniqueId="edit-product-price"
        type="number"
        labelText="Price"
        placeholderText="1,50€"
        defaultValue={product?.price}
      />
    </>
  );
};
