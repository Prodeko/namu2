"use client";

import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiTrash, HiUserAdd } from "react-icons/hi";

import {
  type ClientProduct,
  type UpdateProductFormState,
} from "@/common/types";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { InputWithLabel } from "@/components/ui/Input";
import { createProductAction } from "@/server/actions/admin/createProduct";
import { deactivateProduct } from "@/server/actions/admin/deactivateProduct";
import { ProductCategory } from "@prisma/client";

import { ButtonGroup } from "./Buttons/ButtonGroup";
import { FatButton } from "./Buttons/FatButton";
import { ThinButton } from "./Buttons/ThinButton";
import { ImageUpload } from "./ImageUpload";

interface Props {
  // Autofills the form if a product is given
  product?: ClientProduct;
}

const productCategories = Object.values(ProductCategory);
const categoriesFormatted = productCategories.map(
  (category) =>
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
);

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

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const handleDelete = async (e) => {
    if (!product) return;
    e.stopPropagation();
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
    } else {
      setDeleteConfirmation(false);
      await deactivateProduct(product.id);
    }
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
              choices={categoriesFormatted}
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

        <div className="mt-4 flex gap-4">
          <FatButton
            buttonType="button"
            type="button"
            intent={"secondary"}
            RightIcon={HiTrash}
            text={deleteConfirmation ? "Click again" : "Delete"}
            onClick={(e) => handleDelete(e)}
          />
          <SubmitButton />
        </div>
      </form>
    </>
  );
};
