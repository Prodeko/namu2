"use client";

import { HiShoppingCart, HiX } from "react-icons/hi";
import { HiTrash } from "react-icons/hi2";

import { useSlideinAnimation } from "@/animations/useSlideinAnimation";
import { useShoppingCart } from "@/state/useShoppingCart";
import * as Dialog from "@radix-ui/react-dialog";
import { animated } from "@react-spring/web";
import { useIsClient } from "@uidotdev/usehooks";

import { FatButton } from "./Buttons/FatButton";
import { IconButton } from "./Buttons/IconButton";
import { ThinButton } from "./Buttons/ThinButton";
import { ListItem } from "./ListItem";
import { SectionTitle } from "./SectionTitle";
import { Slider } from "./Slider";

const AnimatedDialog = animated(Dialog.Content);
const AnimatedOverlay = animated(Dialog.Overlay);

export const ShoppingCart = () => {
  const { totalPrice, cart, clearCart } = useShoppingCart();
  const isClient = useIsClient();
  const {
    containerAnimation,
    overlayAnimation,
    open,
    setOpen,
    toggleContainer,
  } = useSlideinAnimation();
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild onClick={toggleContainer}>
        <FatButton
          buttonType="button"
          intent={"primary"}
          text={isClient ? `${totalPrice.toFixed(2)} €` : "Loading..."}
          LeftIcon={HiShoppingCart}
          className="flex-shrink-0"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <AnimatedOverlay
          style={overlayAnimation}
          className="fixed inset-0 z-20 bg-black bg-opacity-25"
        />
        <AnimatedDialog
          style={containerAnimation}
          className="fixed bottom-0 z-20 flex w-full flex-col gap-6 rounded-t-xl bg-white py-12"
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
        </AnimatedDialog>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
