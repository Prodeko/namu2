"use client";

import { type ClientProduct } from "@/common/types";
import { ProductList } from "@/components/ui/ProductList";
import { clearQuery, filterProducts, searchQuery } from "@/state/shopSearch";
import { useSignals } from "@preact/signals-react/runtime";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface Props {
  products: ClientProduct[];
}

/**
 * The filtered product list shown while searching. Replaces the category
 * sections, since search spans every category rather than the active tab.
 */
export const SearchResults = ({ products }: Props) => {
  useSignals();
  const query = searchQuery.value;
  const results = filterProducts(products, query);

  if (results.length === 0) {
    return (
      <section className="flex flex-col items-center gap-3 px-5 py-8 md:px-12">
        <p className="text-center text-lg text-neutral-500 md:text-xl">
          No products match &ldquo;{query.trim()}&rdquo;
        </p>
        <button
          type="button"
          onClick={clearQuery}
          className="text-lg font-bold text-primary-400 md:text-xl"
        >
          Clear search
        </button>
      </section>
    );
  }

  return (
    <>
      {/* Not rendered: the count is only announced, since the field's clear
          button and the trigger already cover clearing the search. */}
      <VisuallyHidden.Root role="status" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"} in all
        categories
      </VisuallyHidden.Root>
      <ProductList items={results} />
    </>
  );
};
