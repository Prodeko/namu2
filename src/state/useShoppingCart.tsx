"use client";

import type { CartProduct, ClientProduct } from "@/common/types";
import { useLocalStorage } from "@uidotdev/usehooks";

export const useShoppingCart = () => {
  const [cart, setCart] = useLocalStorage<CartProduct[]>("shoppingCart", []);

  const updateCart = (updatedItem: CartProduct) => {
    if (updatedItem.quantity < 1) {
      removeItem(updatedItem.id);
      throw new Error("You don't have this item in your cart");
    }
    if (updatedItem.quantity > updatedItem.stock)
      throw new Error("Not enough stock");

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

  const getItemQuantity = (itemId: number): number =>
    getItemById(itemId)?.quantity || 0;

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return {
    cart,
    updateCart,
    hasItem,
    getItemById,
    getItemQuantity,
    removeItem,
    clearCart,
    totalPrice,
  };
};
