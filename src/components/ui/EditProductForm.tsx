"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import toast from "react-hot-toast";
import { HiOutlinePlusCircle, HiUserAdd } from "react-icons/hi";

import type { ClientProduct, UpdateProductFormState } from "@/common/types";
import { AdminTitle } from "@/components/ui/AdminTitle";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Input, InputWithLabel } from "@/components/ui/Input";
import { createProductAction } from "@/server/actions/admin/createProduct";

import { FatButton } from "./Buttons/FatButton";
import { ImageUpload } from "./ImageUpload";

interface Props {
  // Autofills the form if a product is given
  product?: ClientProduct;
}

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <FatButton
      buttonType="button"
      type="submit"
      text={status.pending ? "Saving..." : "Save product"}
      intent="primary"
      RightIcon={HiUserAdd}
      loading={status.pending}
      fullwidth
    />
  );
};

export const EditProductForm = ({ product }: Props) => {
  const [state, formAction] = useFormState<UpdateProductFormState, FormData>(
    createProductAction,
    {
      id: product?.id || null,
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category || "FOOD",
      price: product?.price || 0,
      imageFilePath: product?.imageFilePath || "",
      stock: product?.stock || 0,
      message: "",
    },
  );

  let defaultCategory = product?.category;
  if (defaultCategory) {
    defaultCategory =
      defaultCategory.charAt(0).toUpperCase() +
      defaultCategory.slice(1).toLowerCase();
  }

  useEffect(() => {
    if (state?.message) {
      console.log("state", state);
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <AdminTitle title={product ? "Edit product" : "Add new product"} />
      <form action={formAction}>
        <div className="flex w-full gap-6 portrait:flex-col">
          <div className="flex flex-1 flex-col gap-4">
            <InputWithLabel
              placeholder="Coca-Cola"
              labelText="Name"
              name="name"
              defaultValue={product?.name}
            />
            <DropdownSelect
              labelText="Category"
              placeholder="Select a category..."
              name="category"
              defaultValue={defaultCategory}
              choices={["Drink", "Snack", "Other"]}
            />
          </div>
          <ImageUpload
            defaultValue={product?.imageFilePath}
            name="imageFilePath"
          />
        </div>
        <InputWithLabel
          placeholder="Product description"
          labelText="Description"
          name="description"
          defaultValue={product?.description}
        />
        <InputWithLabel
          type="number"
          labelText="Price"
          placeholder="1,50€"
          name="price"
          defaultValue={product?.price}
          step="any"
        />
        <input
          className="hidden"
          name="stock"
          defaultValue={product?.stock || 0}
        />

        <input type="hidden" name="id" defaultValue={product?.id} />

        <SubmitButton />
      </form>
    </>
  );
};
