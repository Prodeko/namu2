"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiMinus, HiPlus } from "react-icons/hi";

import { useShoppingCart } from "@/state/useShoppingCart";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { ListItemProps } from ".";
import { BasicInfo } from "./ProductBasicInfo";

const ClientListItem = ({
  ref,
  product,
  hideCartIndicator = false,
  ...props
}: ListItemProps & {
  ref: React.RefObject<unknown>;
}) => {
  const { hasItem, updateCart, getItemById } = useShoppingCart();
  const [{ x }, drag] = useSpring(() => ({ x: 0 }));
  const pathname = usePathname();
  const isAdminPage = pathname.includes("admin");

  const bind = useDrag(({ down, movement: [mx] }) => {
    if (isAdminPage) return;
    const dragAmount = Math.max(-100, Math.min(mx, 100)); // Clamp the drag amount between -100 and 100
    if (down) {
      // Case drag
      drag.start({ x: dragAmount, immediate: down });
    } else {
      // Case release
      const count = getItemById(product.id)?.quantity || 0;
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
      // always reset
      drag.start({ x: 0, immediate: down });
    }
  });

  return (
    <div className="relative select-none bg-pink-100">
      <HiPlus className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-primary-400 md:text-2xl" />
      <HiMinus className="absolute right-6 top-1/2 -translate-y-1/2 text-xl text-primary-400 md:text-2xl" />
      <animated.li
        {...props}
        ref={ref}
        {...bind()}
        className="relative flex h-full w-full justify-between gap-3 bg-neutral-50 px-5 py-3 md:px-12 md:py-6 landscape:gap-40"
        style={{ x, touchAction: "pan-y" }}
      >
        {!hideCartIndicator && hasItem(product) && (
          <div className="absolute left-0 top-0 h-full w-2 rounded-r-full bg-pink-400" />
        )}

        <BasicInfo product={product} />
        <div className="flex gap-5">
          <div className="relative w-32 md:w-48">
            <Image
              src={product.imageFilePath}
              alt={product.name}
              className="rounded-lg border-primary-300 md:border-2"
              fill
              style={{ objectFit: "cover" }}
              sizes="33vw"
            />
          </div>
        </div>
      </animated.li>
    </div>
  );
};

export default ClientListItem;
