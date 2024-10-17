"use client";

import toast from "react-hot-toast";

import { logoutAction } from "@/server/actions/auth/logout";
import { purchaseAction } from "@/server/actions/transaction/purchase";
import { ValueError } from "@/server/exceptions/exception";
import { useShoppingCart } from "@/state/useShoppingCart";

import { Slider } from "./Slider";
import { ErrorToast } from "./Toasts/ErrorToast";

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
      await purchaseAction(cart.cart);
      cart.clearCart();
      logoutAction(true);
    } catch (error: any) {
      toast.custom((t) => <ErrorToast t={t} message={error?.message} />);
    }
  };

  return <Slider onSubmit={makePurchase} />;
};
