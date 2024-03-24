"use client";

import Image from "next/image";
import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  Suspense,
  forwardRef,
} from "react";

import { type ClientProduct } from "@/common/types";
import { errorOnServerEnvironment } from "@/common/utils";
import {
  BasicInfo,
  TextInfoLoading,
} from "@/components/ui/ListItem/ProductBasicInfo";
import { useShoppingCart } from "@/state/useShoppingCart";

export interface Props extends ComponentPropsWithRef<"li"> {
  product: ClientProduct;
  hideCartIndicator?: boolean;
}

export const ListItem = forwardRef(
  (props: Props, ref?: ForwardedRef<HTMLLIElement>) => {
    return (
      <Suspense fallback={<ListItemLoading />}>
        <ClientListItem {...props} ref={ref} />
      </Suspense>
    );
  },
);

const ClientListItem = forwardRef(
  (
    { product, hideCartIndicator = false, ...props }: Props,
    ref?: ForwardedRef<HTMLLIElement>,
  ) => {
    errorOnServerEnvironment(
      "ClientListItem component should only be used on the client",
    );
    const { hasItem } = useShoppingCart();
    return (
      <li
        {...props}
        ref={ref}
        className="relative flex h-full w-full justify-between gap-3 px-12 py-6 landscape:gap-40"
      >
        {!hideCartIndicator && hasItem(product) && (
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

const ListItemLoading = () => {
  return (
    <li className="flex h-full w-full justify-between gap-3 py-6 landscape:gap-40">
      <TextInfoLoading />
      <div className="flex gap-5">
        <div className="h-full w-64 animate-pulse rounded-lg bg-primary-200" />
      </div>
    </li>
  );
};
