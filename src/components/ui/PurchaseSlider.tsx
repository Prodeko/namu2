"use client";

import toast from "react-hot-toast";

import { logoutAction } from "@/server/actions/auth/logout";
import { purchaseAction } from "@/server/actions/transaction/purchase";
import { InternalServerError, ValueError } from "@/server/exceptions/exception";
import { useShoppingCart } from "@/state/useShoppingCart";

import { Slider } from "./Slider";

export const PurchaseSlider = () => {
  const cart = useShoppingCart();
  const makePurchase = async () => {
    try {
      if (!cart.cart.length) {
        throw new ValueError({
          message: "Cart is empty!",
          cause: "invalid_value",
        });
      }
      const { error, transactionId } = await purchaseAction(cart.cart);
      if (error) throw new InternalServerError({ message: error });
      cart.clearCart();
      logoutAction(transactionId);
    } catch (error: any) {
      toast.error(error?.message || "Unknown error with purchase");
    }
  };

  return <Slider onSubmit={makePurchase} />;
};
