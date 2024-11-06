"use client";

import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

import type { CartProduct, ClientProduct } from "@/common/types";

export const useShoppingCart = () => {
  const [cart, setCart] = useLocalStorage<CartProduct[]>("shoppingCart", [], {
    initializeWithValue: false,
  });

  const updateCart = (updatedItem: CartProduct) => {
    if (updatedItem.quantity < 1) {
      removeItem(updatedItem.id);
      return;
    }
    setCart((currentCart) => {
      const copiedCart = [...currentCart];
      const existingItem = copiedCart.find((i) => i.id === updatedItem.id);
      if (existingItem) {
        existingItem.quantity = updatedItem.quantity;
      } else {
        copiedCart.push(updatedItem);
      }
      return copiedCart;
    });
  };

  const hasItem = <TProduct extends ClientProduct>(
    product: TProduct,
  ): boolean => {
    return cart.some((item) => item.id === product.id);
  };

  const removeItem = (itemId: number) =>
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));

  const getItemById = (itemId: number): CartProduct | undefined =>
    cart.find((i) => i.id === itemId);

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return {
    cart,
    updateCart,
    hasItem,
    getItemById,
    removeItem,
    clearCart,
    totalPrice,
  };
};
