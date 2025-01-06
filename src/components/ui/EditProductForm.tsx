"use client";

import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiUserAdd } from "react-icons/hi";

import type { ClientProduct, UpdateProductFormState } from "@/common/types";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { InputWithLabel } from "@/components/ui/Input";
import { createProductAction } from "@/server/actions/admin/createProduct";

import { ButtonGroup } from "./Buttons/ButtonGroup";
import { FatButton } from "./Buttons/FatButton";
import { ImageUpload } from "./ImageUpload";

interface Props {
  // Autofills the form if a product is given
  product?: ClientProduct;
}

export const EditProductForm = ({ product }: Props) => {
  const [state, formAction, isPending] = useActionState<
    UpdateProductFormState,
    FormData
  >(createProductAction, {
    id: product?.id || null,
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "FOOD",
    price: product?.price || 0,
    imageFilePath: product?.imageFilePath || "",
    stock: 0,
    message: "",
  });

  let defaultCategory = product?.category;
  if (defaultCategory) {
    defaultCategory =
      defaultCategory.charAt(0).toUpperCase() +
      defaultCategory.slice(1).toLowerCase();
  }

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  const SubmitButton = () => {
    return (
      <FatButton
        className="mt-4"
        buttonType="button"
        type="submit"
        text={isPending ? "Saving..." : "Save product"}
        intent="primary"
        RightIcon={HiUserAdd}
        loading={isPending}
        fullwidth
      />
    );
  };

  return (
    <>
      <form
        action={formAction}
        className="flex min-h-fit w-full flex-col gap-4"
      >
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
        <input className="hidden" name="stock" readOnly value={0} />

        <input type="hidden" name="id" defaultValue={product?.id} />

        <SubmitButton />
      </form>
    </>
  );
};
