"use client";

import Image from "next/image";
import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  forwardRef,
} from "react";

import { type ClientProduct } from "@/common/types";
import { useShoppingCart } from "@/state/useShoppingCart";
import { useIsClient } from "@uidotdev/usehooks";

import { BasicInfo } from "./ProductBasicInfo";

export interface Props extends ComponentPropsWithRef<"li"> {
  product: ClientProduct;
  hideCartIndicator?: boolean;
}

export const ListItem = forwardRef(
  (
    { product, hideCartIndicator = false, ...props }: Props,
    ref?: ForwardedRef<HTMLLIElement>,
  ) => {
    const isClient = useIsClient();
    const { hasItem } = useShoppingCart();
    return (
      <li
        {...props}
        ref={ref}
        className="relative flex h-full w-full justify-between gap-3  py-6 landscape:gap-40"
      >
        {!hideCartIndicator && isClient && hasItem(product) && (
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
