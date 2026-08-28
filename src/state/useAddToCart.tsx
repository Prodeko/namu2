"use client";

import { type ClientProduct } from "@/common/types";
import { useShoppingCart } from "@/state/useShoppingCart";

/**
 * Adds a product to the pending purchase, incrementing the quantity if it is
 * already in the cart. Shared by the browse list and the search results so a
 * result row behaves exactly like a normal list row.
 */
export const useAddToCart = () => {
  const { updateCart, getItemById } = useShoppingCart();

  return (product: ClientProduct) => {
    const itemCount = getItemById(product.id)?.quantity || 0;
    updateCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: itemCount + 1,
      imageFilePath: product.imageFilePath,
      category: product.category,
      description: product.description,
      stock: product.stock,
      isDisabled: product.isDisabled,
    });
  };
};
