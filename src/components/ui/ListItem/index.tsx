"use client";

import Image from "next/image";
import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  Suspense,
  forwardRef,
} from "react";
import { toast } from "react-hot-toast";
import { HiMinus, HiPlus } from "react-icons/hi";

import { type ClientProduct } from "@/common/types";
import { errorOnServerEnvironment } from "@/common/utils";
import { ErrorToast } from "@/components/Toasts/ErrorToast";
import {
  BasicInfo,
  TextInfoLoading,
} from "@/components/ui/ListItem/ProductBasicInfo";
import { useShoppingCart } from "@/state/useShoppingCart";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

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
    const { hasItem, updateCart, getItemQuantity } = useShoppingCart();
    const [{ x }, drag] = useSpring(() => ({ x: 0 }));

    const bind = useDrag(({ down, movement: [mx] }) => {
      const dragAmount = Math.max(-100, Math.min(mx, 100)); // Clamp the drag amount between -100 and 100
      if (down) {
        // Case drag
        drag.start({ x: dragAmount, immediate: down });
      } else {
        // Case release
        const count = getItemQuantity(product.id);
        try {
          if (mx >= 100) {
            updateCart({
              ...product,
              quantity: count + 1,
            });
          } else if (mx <= -100 && count > 0) {
            updateCart({
              ...product,
              quantity: count - 1,
            });
          }
        } catch (error) {
          toast.error(String(error));
        }

        // always reset
        drag.start({ x: 0, immediate: down });
      }
    });

    return (
      <div className="relative bg-pink-100">
        <HiPlus
          size={40}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-400"
        />
        <HiMinus
          size={40}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-400"
        />
        <animated.li
          {...props}
          ref={ref}
          {...bind()}
          className="relative flex h-full w-full justify-between gap-3 bg-neutral-50 px-12 py-6 landscape:gap-40"
          style={{ x, touchAction: "pan-y" }}
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
        </animated.li>
      </div>
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
