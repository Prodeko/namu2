"use client";

import { type ClientProduct } from "@/common/types";
import { ProductSection } from "@/components/ui/ProductSection";
import { sections } from "@/state/activeSection";
import { searchQuery } from "@/state/shopSearch";
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

  if (searchQuery.value.trim()) {
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
