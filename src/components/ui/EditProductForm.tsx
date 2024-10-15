"use client";

import { HiOutlinePlusCircle } from "react-icons/hi";

import type { ClientProduct } from "@/common/types";
import { AdminTitle } from "@/components/ui/AdminTitle";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { InputWithLabel } from "@/components/ui/Input";

import { ImageUpload } from "./ImageUpload";

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
            placeholder="Coca-Cola"
            labelText="Name"
            defaultValue={product?.name}
          />
          <DropdownSelect
            labelText="Category"
            placeholder="Select a category..."
            choices={["Drink", "Snack", "Other"]}
          />
        </div>
        <ImageUpload />
      </div>
      <InputWithLabel
        placeholder="Product description"
        labelText="Description"
        defaultValue={product?.description}
      />
      <InputWithLabel
        type="number"
        labelText="Price"
        placeholder="1,50€"
        defaultValue={product?.price}
      />
    </>
  );
};
