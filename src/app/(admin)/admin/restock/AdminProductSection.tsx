"use client";

import { useState } from "react";
import { HiOutlineSave, HiX } from "react-icons/hi";

import { ClientProduct } from "@/common/types";
import { AnimatedPopup } from "@/components/ui/AnimatedPopup";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { EditProductForm } from "@/components/ui/EditProductForm";
import { Input } from "@/components/ui/Input";
import { ListItem } from "@/components/ui/ListItem";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  products: ClientProduct[];
}

export const AdminProductSection = ({ products }: Props) => {
  const [productFilter, setProductFilter] = useState<string>("");
  const filteredProducts = products.filter((product) => {
    if (!productFilter) return true;
    const nameIncludes = product.name.toLowerCase().includes(productFilter);
    const categoryIncludes = product.category.includes(productFilter);
    return nameIncludes || categoryIncludes;
  });

  return (
    <section className="flex flex-col gap-3">
      <div className="flex w-full items-center justify-between gap-8 text-xl text-neutral-800">
        <span className="flex-none text-neutral-500">
          Displaying {filteredProducts.length} of {products.length} products
        </span>
        <Input
          placeholder="Search by name or category..."
          onChange={(e) => setProductFilter(e.target.value.toLowerCase())}
        />
      </div>
      <div className="flex flex-col  divide-y-2 divide-primary-200">
        {filteredProducts.map((product) => (
          <AnimatedPopup
            key={product.id}
            TriggerComponent={<ListItem hideCartIndicator product={product} />}
          >
            <div className=" flex flex-col rounded-xl bg-neutral-50 px-20 py-20 shadow-lg portrait:w-[80vw] landscape:w-[50vw] ">
              <div className="flex flex-col gap-8">
                <EditProductForm product={product} />
                <Dialog.Close asChild>
                  <div className="flex w-full gap-4 portrait:flex-col">
                    <FatButton
                      buttonType="button"
                      text="Cancel"
                      intent="secondary"
                      RightIcon={HiX}
                    />
                    <FatButton
                      buttonType="button"
                      text="Save product"
                      intent="primary"
                      RightIcon={HiOutlineSave}
                    />
                  </div>
                </Dialog.Close>
              </div>
            </div>
          </AnimatedPopup>
        ))}
      </div>
    </section>
  );
};
