"use client";

import { HiShoppingCart, HiX } from "react-icons/hi";
import { HiTrash } from "react-icons/hi2";

import { useShoppingCart } from "@/state/useShoppingCart";
import * as Dialog from "@radix-ui/react-dialog";
import { useIsClient } from "@uidotdev/usehooks";

import { AnimatedModal } from "./AnimatedModal";
import { FatButton } from "./Buttons/FatButton";
import { IconButton } from "./Buttons/IconButton";
import { ThinButton } from "./Buttons/ThinButton";
import { ListItem } from "./ListItem";
import { SectionTitle } from "./SectionTitle";
import { Slider } from "./Slider";

export const ShoppingCart = () => {
  const { totalPrice, cart, clearCart } = useShoppingCart();
  const isClient = useIsClient();
  return (
    <AnimatedModal
      intent={"bottom"}
      TriggerComponent={
        <FatButton
          buttonType="button"
          intent={"primary"}
          text={isClient ? `${totalPrice.toFixed(2)} €` : "Loading..."}
          LeftIcon={HiShoppingCart}
          className="min-w-fit flex-shrink-0"
        />
      }
    >
      <div className="flex justify-between gap-4 px-12">
        <Dialog.Title asChild>
          <SectionTitle title="Shopping Cart" />
        </Dialog.Title>
        <Dialog.Close asChild>
          <IconButton Icon={HiX} sizing="sm" buttonType="button" />
        </Dialog.Close>
      </div>
      <div className="flex flex-col divide-y-2 divide-neutral-200">
        {cart.map((product) => (
          <ListItem key={product.id} product={product} />
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 px-12">
        <div className="flex gap-0.5 text-3xl font-medium">
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
      <div className="px-12">
        <Slider />
      </div>
    </AnimatedModal>
  );
};
