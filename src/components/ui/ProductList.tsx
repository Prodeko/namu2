"use client";

import { type ClientProduct } from "@/common/types";
import { useAddToCart } from "@/state/useAddToCart";

import { ListItem } from "./ListItem";

interface Props {
  items: ClientProduct[];
}

/**
 * The divided list of product rows, shared by the category sections and the
 * search results so a result row behaves exactly like a browse row.
 */
export const ProductList = ({ items }: Props) => {
  const addToCart = useAddToCart();

  return (
    <ul className="flex flex-col divide-y-2 divide-neutral-200">
      {items.map((item) => (
        <ListItem
          key={item.id}
          product={item}
          onClick={() => addToCart(item)}
        />
      ))}
    </ul>
  );
};
