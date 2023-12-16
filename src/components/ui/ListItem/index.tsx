import Image from "next/image";
import { type ComponentProps } from "react";

import { type CartProduct } from "@/common/types";
import { useShoppingCart } from "@/state/useShoppingCart";

import { BasicInfo } from "./ProductBasicInfo";

export interface Props extends ComponentProps<"li"> {
  product: CartProduct;
}

export const ListItem = ({ product, ...props }: Props) => {
  const { hasItem } = useShoppingCart();
  return (
    <li
      {...props}
      className="relative flex h-full w-full justify-between px-12 py-6"
    >
      {hasItem(product) && (
        <div className="absolute left-0 top-0 h-full w-2 rounded-r-full bg-pink-400" />
      )}
      <BasicInfo product={product} />
      <div className="flex gap-5">
        <div className="relative w-64">
          <Image
            src="/pepsi.jpg"
            alt={product.name}
            className="rounded-lg border-2 border-primary-300"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </li>
  );
};
