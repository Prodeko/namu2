"use client";

import { HiTrash } from "react-icons/hi2";

import { useShoppingCart } from "@/state/useShoppingCart";
import { ListItem } from "@/components/ui/ListItem";
import { PurchaseSlider } from "@/components/ui/PurchaseSlider";
import { ThinButton } from "@/components/ui/Buttons/ThinButton";

import { Modal } from "../Modal";
import { useModalNav } from "../ModalNavContext";
import { createModalFlow } from "../modalSystem";

const CartContent = () => {
  const nav = useModalNav<void>();
  const { cart, totalPrice, clearCart } = useShoppingCart();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col divide-y-2 divide-neutral-200">
        {cart.map((product) => (
          <ListItem key={product.id} product={product} />
        ))}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-0.5 text-xl font-medium md:text-3xl">
          <span className="text-neutral-900">Total:</span>
          <span className="text-primary-500">{totalPrice.toFixed(2)}€</span>
        </div>
        <ThinButton
          buttonType="button"
          intent={"danger"}
          RightIcon={HiTrash}
          text="Clear cart"
          onClick={() => {
            clearCart();
            nav.close();
          }}
        />
      </div>
      <PurchaseSlider />
    </div>
  );
};

export const CartFlow = createModalFlow<Record<string, never>, void>(() => (
  <Modal forceBottomSheet>
    <Modal.Page title="Shopping Cart">
      <CartContent />
    </Modal.Page>
  </Modal>
));
