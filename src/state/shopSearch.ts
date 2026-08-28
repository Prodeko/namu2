import { type ClientProduct } from "@/common/types";
import { batch, signal } from "@preact/signals-react";

/** How long the balance cards take to fold away and back. */
export const cardCollapseMs = 200;

/** Whether the search UI is open. Drives layout, focus and the keyboard. */
export const searchOpen = signal<boolean>(false);

/** Live value of the search input. */
export const searchQuery = signal<string>("");

/** Scroll offset captured when search opens, restored when it closes. */
const previousScrollOffset = signal<number>(0);

/**
 * Scroll offset waiting to be restored, or `null` when there is nothing to
 * restore. The page is only tall enough to scroll once the category sections
 * have remounted, so the restore is performed by `ShopCatalogue` after it
 * renders the unfiltered list again.
 */
export const pendingScrollRestore = signal<number | null>(null);

/**
 * Whether a product matches a search query. Matches case-insensitively on the
 * product name and description, substring anywhere.
 */
export const matchesQuery = (
  product: ClientProduct,
  query: string,
): boolean => {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    product.name.toLowerCase().includes(needle) ||
    product.description.toLowerCase().includes(needle)
  );
};

/**
 * Filters a product list by a query. Returns the list unchanged when the query
 * is empty.
 *
 * The catalogue is already loaded client side, so filtering is local and runs on
 * every keystroke. If the catalogue outgrows local filtering, replace this with
 * a debounced server query behind the same state shape.
 */
export const filterProducts = (
  products: ClientProduct[],
  query: string,
): ClientProduct[] => {
  if (!query.trim()) return products;
  return products.filter((product) => matchesQuery(product, query));
};

export const openSearch = () => {
  if (searchOpen.value) return;
  batch(() => {
    previousScrollOffset.value = window.scrollY;
    pendingScrollRestore.value = null;
    searchOpen.value = true;
  });
};

/**
 * Closes search and restores the unfiltered list.
 *
 * @param restoreScroll - Whether to return to the scroll position the page had
 * when search was opened. Pass `false` when the caller scrolls somewhere else
 * itself, such as a category tab.
 */
export const closeSearch = ({ restoreScroll = true } = {}) => {
  if (!searchOpen.value) return;
  // Batched so the pending offset is in place before the sections rerender and
  // ShopCatalogue's restore effect runs.
  batch(() => {
    pendingScrollRestore.value = restoreScroll
      ? previousScrollOffset.value
      : null;
    searchOpen.value = false;
    searchQuery.value = "";
  });
};

export const clearQuery = () => {
  searchQuery.value = "";
};
