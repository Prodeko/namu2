"use client";

import { type ComponentProps } from "react";
import { HiShoppingCart } from "react-icons/hi2";

import { type CartProduct } from "@/common/types";
import { ShoppingCart as ShoppingCartStorage } from "@/state/shoppingCart";
import * as Dialog from "@radix-ui/react-dialog";

import { FatButton } from "./Buttons/FatButton";
import { ListItem } from "./ListItem";
import { SectionTitle } from "./SectionTitle";

type DivProps = ComponentProps<"div">;

export interface Props extends DivProps {
  cartItems: CartProduct[];
  setCartItems: (newCartItems: CartProduct[]) => void;
}

// export const ShoppingCart = ({ cartItems, setCartItems, ...props }: Props) => {
//   return (
//     <div {...props} className="grid gap-6 border-2 p-6">
//       <div>
//         <div className="text-4xl font-bold text-neutral-700">Cart</div>
//         <div className="h-96 overflow-auto">
//           {ShoppingCartStorage.getItems().map((product) => (
//             <ListItem key={product.id} product={product} />
//           ))}
//         </div>
//       </div>
//       <div className="inline-flex">
//         <span className="text-3xl font-medium text-neutral-900">Total:</span>
//         &nbsp;
//         <span className="text-3xl font-medium text-primary-500">
//           {ShoppingCartStorage.getPrice()}€
//         </span>
//       </div>
//     </div>
//   );
// };

export const ShoppingCart = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <FatButton
          buttonType="button"
          intent={"primary"}
          text={`${ShoppingCartStorage.getPrice()} €`}
          LeftIcon={HiShoppingCart}
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-4 bg-black bg-opacity-25" />
        <Dialog.Content className="fixed bottom-0 flex flex-col gap-6 py-12">
          <Dialog.Title asChild>
            <SectionTitle title="Shopping Cart" />
          </Dialog.Title>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
