import { type ClientProduct } from "@/common/types";
import { signal } from "@preact/signals-react";

/** Whether the search UI is open. Drives layout, focus and the keyboard. */
export const searchOpen = signal<boolean>(false);

/** Live value of the search input. */
export const searchQuery = signal<string>("");

/**
 * Filters a product list by a query, matching case-insensitively on the product
 * name and description, substring anywhere. Returns the list unchanged when the
 * query is empty.
 *
 * The catalogue is already loaded client side, so filtering is local and runs on
 * every keystroke. If the catalogue outgrows local filtering, replace this with
 * a debounced server query behind the same state shape.
 */
export const filterProducts = (
  products: ClientProduct[],
  query: string,
): ClientProduct[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return products;
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(needle) ||
      product.description.toLowerCase().includes(needle),
  );
};

export const openSearch = () => {
  searchOpen.value = true;
};

/** Closes search and restores the unfiltered list. */
export const closeSearch = () => {
  searchOpen.value = false;
  searchQuery.value = "";
};

export const clearQuery = () => {
  searchQuery.value = "";
};
