"use client";

import { type ClientProduct } from "@/common/types";
import { useShoppingCart } from "@/state/useShoppingCart";
import { useIsClient } from "@uidotdev/usehooks";

export const BasicInfo = ({ product }: { product: ClientProduct }) => {
  const { getItemById } = useShoppingCart();
  const item = getItemById(product.id);
  const isClient = useIsClient();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <h3 className="text-2xl font-semibold text-neutral-800">
          {isClient && item?.quantity && <span>{item.quantity} x </span>}
          <span>{product.name}</span>
        </h3>
        <p className="two-line-ellipsis text-xl font-light text-neutral-600">
          {product.description}
        </p>
      </div>
      <p className="text-2xl font-semibold text-primary-400">
        {product.price.toFixed(2)} €
      </p>
    </div>
  );
};
