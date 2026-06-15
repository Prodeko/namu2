"use client";

import { useState } from "react";
import { HiPlus } from "react-icons/hi";

import { ClientProduct } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { ListItem } from "@/components/ui/ListItem";
import { showModal } from "@/components/ui/modal";
import { EditProductFlow } from "@/components/ui/modal/flows/EditProductFlow";

interface Props {
  products: ClientProduct[];
}

export const AdminProductSection = ({ products }: Props) => {
  const [productFilter, setProductFilter] = useState<string>("");

  const filteredProducts = products.filter((product: ClientProduct) => {
    if (!productFilter) return true;
    const nameIncludes = product.name.toLowerCase().includes(productFilter);
    const categoryIncludes = product.category.includes(productFilter);
    return nameIncludes || categoryIncludes;
  });

  return (
    <section className="flex flex-col gap-3">
      <div className="flex w-full flex-col items-start justify-between gap-4 px-5 text-sm text-neutral-800 md:flex-row md:items-center md:gap-6 md:px-12 md:text-xl">
        <span className="flex-none text-neutral-500">
          Displaying {filteredProducts.length} of {products.length} products
        </span>

        <FatButton
          buttonType="button"
          type="button"
          text="New product"
          intent="primary"
          className="portrait:w-full"
          RightIcon={HiPlus}
          onClick={() => void showModal(EditProductFlow, {})}
        />
      </div>
      <div className="flex flex-col  divide-y-2 divide-primary-200 ">
        {filteredProducts.map((product) => (
          <ListItem
            key={product.id}
            hideCartIndicator
            product={product}
            onClick={() => void showModal(EditProductFlow, { product })}
          />
        ))}
      </div>
    </section>
  );
};
