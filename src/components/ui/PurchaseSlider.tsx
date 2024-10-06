"use client";

import { logoutAction } from "@/server/actions/auth/logout";
import { purchaseAction } from "@/server/actions/transaction/purchase";
import { useShoppingCart } from "@/state/useShoppingCart";

import { Slider } from "./Slider";

export const PurchaseSlider = () => {
  const cart = useShoppingCart();
  const makePurchase = async () => {
    try {
      console.log("making purchase with cart", cart.cart);
      await purchaseAction(cart.cart);
      console.log("successfully purchased");
      cart.clearCart();
      logoutAction(true);
    } catch (error) {
      console.log("error with purchase", error);
    }
  };

  return <Slider onSubmit={makePurchase} />;
};
