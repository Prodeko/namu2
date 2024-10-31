"use client";

import { useRef, useState } from "react";
import { HiX } from "react-icons/hi";

import { ClientProduct } from "@/common/types";
import { AnimatedPopup, PopupRefActions } from "@/components/ui/AnimatedPopup";
import { EditProductForm } from "@/components/ui/EditProductForm";
import { Input } from "@/components/ui/Input";
import { ListItem } from "@/components/ui/ListItem";

interface Props {
  products: ClientProduct[];
}

export const AdminProductSection = ({ products }: Props) => {
  const [productFilter, setProductFilter] = useState<string>("");
  const popupRef = useRef<PopupRefActions>(undefined);

  const filteredProducts = products.filter((product) => {
    if (!productFilter) return true;
    const nameIncludes = product.name.toLowerCase().includes(productFilter);
    const categoryIncludes = product.category.includes(productFilter);
    return nameIncludes || categoryIncludes;
  });

  return (
    <section className="flex flex-col gap-3">
      <div className="tex-lg flex w-full flex-col items-start justify-between gap-4 px-5 text-neutral-800 md:flex-row md:items-center md:gap-6 md:px-12 md:text-xl">
        <span className="flex-none text-neutral-500">
          Displaying {filteredProducts.length} of {products.length} products
        </span>
        <Input
          placeholder="Search by name or category..."
          onChange={(e) => setProductFilter(e.target.value.toLowerCase())}
        />
      </div>
      <div className="flex flex-col  divide-y-2 divide-primary-200 ">
        {filteredProducts.map((product) => (
          <AnimatedPopup
            key={product.id}
            TriggerComponent={<ListItem hideCartIndicator product={product} />}
            ref={popupRef}
          >
            <div className="flex max-h-[95vh] flex-col overflow-scroll rounded-xl bg-neutral-50 py-6 md:py-12 portrait:w-[80vw] landscape:w-[50vw] ">
              <div className="flex w-full items-center justify-between">
                <p className="text-xl font-bold text-primary-400 md:text-3xl">
                  Edit product
                </p>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-lg text-primary-400 md:h-16 md:w-16 md:border-2 md:text-4xl"
                  onClick={() => popupRef?.current?.closeContainer()}
                >
                  <HiX />
                </div>
              </div>
              <EditProductForm product={product} />
            </div>
          </AnimatedPopup>
        ))}
      </div>
    </section>
  );
};
