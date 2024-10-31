"use server";

import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

import {
  UpdateProductFormState,
  updateProductDetailsParser,
} from "@/common/types";
import { db } from "@/server/db/prisma";
import { createProduct, updateProduct } from "@/server/db/queries/product";
import { ValueError } from "@/server/exceptions/exception";
import { PrismaClient } from "@prisma/client";

export const createProductAction = async (
  prevState: UpdateProductFormState,
  formData: FormData,
): Promise<UpdateProductFormState> => {
  const formIdString = formData.get("id") as string;
  const formId = parseInt(formIdString) || null;
  const formName = formData.get("name") as string | undefined;
  const formDescription = formData.get("description") as string | undefined;
  const formPriceString = (formData.get("price") as string) || "";
  const formPrice = parseFloat(formPriceString);
  const formCategory = (
    formData.get("category") as string | undefined
  )?.toUpperCase();
  const formStockString = (formData.get("stock") as string) || "";
  const formStock = parseInt(formStockString);
  const formImageFilePath = formData.get("imageFilePath") as string | undefined;

  const input = updateProductDetailsParser.safeParse({
    id: formId,
    name: formName,
    description: formDescription,
    category: formCategory,
    price: formPrice,
    imageFilePath: formImageFilePath,
    stock: formStock,
  });

  const isNewProduct = formId === null;
  try {
    if (!formName) {
      throw new ValueError({
        cause: "missing_value",
        message: "Name is required",
      });
    }

    if (!formDescription) {
      throw new ValueError({
        cause: "missing_value",
        message: "Description is required",
      });
    }

    if (formPrice === undefined) {
      throw new ValueError({
        cause: "missing_value",
        message: "Price is required",
      });
    }

    if (!formCategory) {
      throw new ValueError({
        cause: "missing_value",
        message: "Category is required",
      });
    }

    if (formStock === undefined) {
      throw new ValueError({
        cause: "missing_value",
        message: "Stock is required",
      });
    }

    if (!input.success) {
      throw new ValueError({
        cause: "invalid_value",
        message: "Invalid product details",
      });
    }

    if (!formImageFilePath) {
      throw new ValueError({
        cause: "missing_value",
        message: "Image file path is required",
      });
    }

    await db.$transaction(async (tx) => {
      try {
        if (isNewProduct) await createProduct(tx as PrismaClient, input.data);
        else await updateProduct(tx as PrismaClient, input.data);
      } catch (error: any) {
        throw error?.message || "Unknown error when adding funds";
      }
    });
  } catch (error) {
    return {
      ...prevState,
      message:
        error instanceof ValueError ? error.message : "Unknown error occurred",
    };
  }

  revalidatePath("/admin");
  redirect("/admin/restock", RedirectType.push);

  return {
    id: null,
    name: "",
    description: "",
    category: "FOOD",
    price: 0,
    imageFilePath: "",
    stock: 0,
    message: "",
  };
};
