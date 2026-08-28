"use client";

import { useEffect } from "react";

import { type ClientProduct } from "@/common/types";
import { ProductSection } from "@/components/ui/ProductSection";
import { sections } from "@/state/activeSection";
import {
  cardCollapseMs,
  pendingScrollRestore,
  searchOpen,
  searchQuery,
} from "@/state/shopSearch";
import { useSignals } from "@preact/signals-react/runtime";

import { SearchResults } from "./SearchResults";

interface Props {
  products: ClientProduct[];
  favorites: ClientProduct[];
}

/**
 * Switches the shop between browsing by category and the flat search result
 * list. Both read the same catalogue, so no extra fetching is needed.
 */
export const ShopCatalogue = ({ products, favorites }: Props) => {
  useSignals();
  const isSearching = Boolean(searchQuery.value.trim());
  const isOpen = searchOpen.value;

  // Restoring the pre-search scroll offset has to wait until the sections are
  // back in the DOM, otherwise the page is too short and the scroll is clamped.
  // Depending on isOpen as well means a search closed without typing anything
  // still restores, and never leaves a stale offset behind.
  useEffect(() => {
    // peek() so clearing the signal below does not re-trigger this render.
    const offset = pendingScrollRestore.peek();
    if (isOpen || isSearching || offset === null) return;
    pendingScrollRestore.value = null;
    window.scrollTo({ top: offset });
    // The balance cards animate back open over cardCollapseMs, and scroll
    // anchoring nudges the offset while they grow, so re-assert it once the
    // layout has settled.
    const settle = setTimeout(
      () => window.scrollTo({ top: offset }),
      cardCollapseMs + 50,
    );
    return () => clearTimeout(settle);
  }, [isSearching, isOpen]);

  if (isSearching) {
    return <SearchResults products={products} />;
  }

  return (
    <>
      <ProductSection section={sections.favorites} items={favorites} />
      <ProductSection
        section={sections.drinks}
        items={products.filter((product) => product.category === "DRINK")}
      />
      <ProductSection
        section={sections.snacks}
        items={products.filter((product) => product.category === "SNACK")}
      />
      <ProductSection
        section={sections.food}
        items={products.filter((product) => product.category === "FOOD")}
      />
      <ProductSection
        section={sections.candy}
        items={products.filter((product) => product.category === "CANDY")}
      />
    </>
  );
};
