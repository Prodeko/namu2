"use client";

import { Suspense } from "react";

import { type ClientProduct } from "@/common/types";
import { useShoppingCart } from "@/state/useShoppingCart";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const BasicInfo = ({ product }: { product: ClientProduct }) => {
  return (
    <Suspense fallback={<TextInfoLoading />}>
      <TextInfo product={product} />
    </Suspense>
  );
};

const TextInfo = ({ product }: { product: ClientProduct }) => {
  const [parent] = useAutoAnimate();

  const { getItemById } = useShoppingCart();
  const item = getItemById(product.id);
  return (
    <div className="flex flex-grow flex-col gap-3 text-left">
      <div className="flex flex-col">
        <h3
          ref={parent}
          className="flex gap-2 text-lg font-semibold text-neutral-800 md:text-xl"
        >
          {item?.quantity && <span>{item.quantity} x </span>}
          <span>{product.name}</span>
        </h3>
        <p className="two-line-ellipsis text-md font-light text-neutral-600 md:text-lg">
          {product.description}
        </p>
      </div>
      <p className="text-lg font-semibold text-primary-400 md:text-xl">
        {product.price.toFixed(2)} €
      </p>
    </div>
  );
};

export const TextInfoLoading = () => {
  return (
    <div className="flex flex-col gap-3 text-left ">
      <div className="flex flex-col">
        <div className="h-8 w-full animate-pulse rounded-xl bg-primary-200" />
        <div className="h-6 w-full animate-pulse rounded-xl bg-primary-200" />
      </div>
      <div className="h-8 w-full animate-pulse rounded-xl bg-primary-200" />
    </div>
  );
};
