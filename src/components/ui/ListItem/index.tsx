"use client";

import Image from "next/image";
import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  forwardRef,
} from "react";

import { type CartProduct } from "@/common/types";
import { useShoppingCart } from "@/state/useShoppingCart";
import { useIsClient } from "@uidotdev/usehooks";

import { BasicInfo } from "./ProductBasicInfo";

export interface Props extends ComponentPropsWithRef<"li"> {
  product: CartProduct;
}

export const ListItem = forwardRef(
  ({ product, ...props }: Props, ref?: ForwardedRef<HTMLLIElement>) => {
    const isClient = useIsClient();
    const { hasItem } = useShoppingCart();
    return (
      <li
        {...props}
        ref={ref}
        className="relative flex h-full w-full justify-between gap-3 px-12 py-6"
      >
        {isClient && hasItem(product) && (
          <div className="absolute left-0 top-0 h-full w-2 rounded-r-full bg-pink-400" />
        )}
        <BasicInfo product={product} />
        <div className="flex gap-5">
          <div className="relative w-64">
            <Image
              src="/pepsi.jpg"
              alt={product.name}
              className="rounded-lg border-2 border-primary-300"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </li>
    );
  },
);
