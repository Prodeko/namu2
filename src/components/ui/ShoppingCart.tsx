"use client";

import { useMemo } from "react";
import { HiShoppingCart } from "react-icons/hi";

import { useShoppingCart } from "@/state/useShoppingCart";
import { useIsClient } from "@uidotdev/usehooks";

import { FatButton } from "./Buttons/FatButton";
import { showModal } from "@/components/ui/modal";
import { CartFlow } from "@/components/ui/modal/flows/CartFlow";
import { cva } from "class-variance-authority";

const cartStyles = cva(
  "z-10 -mb-10 flex w-full justify-between rounded-t-3xl border-2 border-primary-300 bg-primary-100 px-5 pb-9 pt-2 text-center font-medium text-primary-500 shadow-lg transition-all md:hidden",
  {
    variants: {
      visible: {
        true: "translate-y-0 opacity-100",
        false: "translate-y-5 opacity-0",
      },
    },
  },
);

export const ShoppingCart = () => {
  const { totalPrice, cart } = useShoppingCart();
  const itemCount = useMemo(
    () => cart.reduce((prev, item) => prev + item.quantity, 0),
    [cart],
  );
  const isClient = useIsClient();

  const openCart = () => void showModal(CartFlow);

  return (
    <>
      <FatButton
        buttonType="button"
        intent={"primary"}
        text={isClient ? `${totalPrice.toFixed(2)} €` : "Loading..."}
        LeftIcon={HiShoppingCart}
        className="hidden min-w-fit flex-shrink-0 md:flex"
        onClick={openCart}
      />
      <button
        type="button"
        className={cartStyles({ visible: itemCount > 0 })}
        onClick={openCart}
      >
        <p className="flex items-center gap-1 font-bold">
          <HiShoppingCart /> Cart
        </p>
        <p className="font-bold ">
          {itemCount} item{itemCount !== 1 ? "s" : ""} -{" "}
          {isClient ? `${totalPrice.toFixed(2)} €` : "Loading..."}
        </p>
      </button>
    </>
  );
};
