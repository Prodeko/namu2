"use client";

import { cva } from "class-variance-authority";
import { useMemo } from "react";
import { HiShoppingCart, HiX } from "react-icons/hi";
import { HiTrash } from "react-icons/hi2";

import { useShoppingCart } from "@/state/useShoppingCart";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useIsClient } from "@uidotdev/usehooks";

import { AnimatedModal } from "./AnimatedModal";
import { FatButton } from "./Buttons/FatButton";
import { ThinButton } from "./Buttons/ThinButton";
import { ListItem } from "./ListItem";
import { PurchaseSlider } from "./PurchaseSlider";
import { SectionTitle } from "./SectionTitle";
import { Slider } from "./Slider";

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
  const { totalPrice, cart, clearCart } = useShoppingCart();
  const itemCount = useMemo(
    () => cart.reduce((prev, item) => prev + item.quantity, 0),
    [cart],
  );
  const isClient = useIsClient();
  const CartButton = () => (
    <span className="flex min-w-fit">
      <FatButton
        buttonType="button"
        intent={"primary"}
        text={isClient ? `${totalPrice.toFixed(2)} €` : "Loading..."}
        LeftIcon={HiShoppingCart}
        className="hidden min-w-fit flex-shrink-0 md:flex"
      />
      <div className={cartStyles({ visible: itemCount > 0 })}>
        <p className="flex items-center gap-1 font-bold">
          <HiShoppingCart /> Cart
        </p>
        <p className="font-bold ">
          {itemCount} item{itemCount !== 1 ? "s" : ""} -{" "}
          {isClient ? `${totalPrice.toFixed(2)} €` : "Loading..."}
        </p>
      </div>
    </span>
  );

  return (
    <AnimatedModal intent={"bottom"} TriggerComponent={CartButton()}>
      <div className="flex items-center justify-between gap-4 px-5 md:px-12">
        <Dialog.Title asChild>
          <SectionTitle title="Shopping Cart" />
        </Dialog.Title>
        <Dialog.Close asChild>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-primary-50 text-lg text-primary-400 shadow-inner md:h-16 md:w-16 md:border-2 md:text-4xl">
            <HiX />
          </div>
        </Dialog.Close>
      </div>
      <div className="flex flex-col divide-y-2 divide-neutral-200">
        {cart.map((product) => (
          <ListItem key={product.id} product={product} />
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 px-5 md:px-12">
        <div className="flex gap-0.5 text-xl font-medium md:text-3xl">
          <span className="text-neutral-900">Total:</span>
          <span className="text-primary-500">{totalPrice.toFixed(2)}€</span>
        </div>
        <Dialog.Close asChild>
          <ThinButton
            buttonType="button"
            intent={"danger"}
            RightIcon={HiTrash}
            text="Clear cart"
            onClick={() => clearCart()}
          />
        </Dialog.Close>
      </div>
      <div className="px-5 md:px-12">
        <PurchaseSlider />
      </div>
    </AnimatedModal>
  );
};
