"use client";

import { type ClientProduct } from "@/common/types";
import { ListItem } from "@/components/ui/ListItem";
import { clearQuery, filterProducts, searchQuery } from "@/state/shopSearch";
import { useAddToCart } from "@/state/useAddToCart";
import { useSignals } from "@preact/signals-react/runtime";

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
  const addToCart = useAddToCart();
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
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-5 md:px-12">
        <span
          role="status"
          aria-live="polite"
          className="text-sm text-neutral-500 md:text-base"
        >
          {results.length} {results.length === 1 ? "result" : "results"} in all
          categories
        </span>
        <button
          type="button"
          onClick={clearQuery}
          className="shrink-0 text-sm font-bold text-primary-400 md:text-base"
        >
          Clear
        </button>
      </div>
      <ul className="flex flex-col divide-y-2 divide-neutral-200">
        {results.map((product) => (
          <ListItem
            key={product.id}
            product={product}
            onClick={() => addToCart(product)}
          />
        ))}
      </ul>
    </section>
  );
};
