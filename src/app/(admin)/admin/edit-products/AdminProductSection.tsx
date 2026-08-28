"use client";

import { useState } from "react";
import { HiPlus } from "react-icons/hi";

import { ClientProduct } from "@/common/types";
import { FatButton } from "@/components/ui/Buttons/FatButton";
import { ListItem } from "@/components/ui/ListItem";
import { RadioInput } from "@/components/ui/RadioInput";
import { showModal } from "@/components/ui/modal";
import { EditProductFlow } from "@/components/ui/modal/flows/EditProductFlow";

interface Props {
  products: ClientProduct[];
}

const statusFilters = ["All", "Enabled", "Disabled"] as const;
type StatusFilter = (typeof statusFilters)[number];

export const AdminProductSection = ({ products }: Props) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filteredProducts = products.filter((product: ClientProduct) => {
    if (statusFilter === "Enabled") return !product.isDisabled;
    if (statusFilter === "Disabled") return product.isDisabled;
    return true;
  });

  return (
    <section className="flex flex-col gap-3">
      <div className="flex w-full flex-col items-start justify-between gap-4 px-5 text-sm text-neutral-800 md:flex-row md:items-center md:gap-6 md:px-12 md:text-xl">
        <span className="flex-none text-neutral-500">
          Displaying {filteredProducts.length} of {products.length} products
        </span>

        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
          <RadioInput
            style="pill"
            options={statusFilters}
            defaultValue="All"
            onChange={setStatusFilter}
            className="md:w-80"
          />
          <FatButton
            buttonType="button"
            type="button"
            text="New product"
            intent="primary"
            className="whitespace-nowrap portrait:w-full"
            RightIcon={HiPlus}
            onClick={() => void showModal(EditProductFlow, {})}
          />
        </div>
      </div>
      <div className="flex flex-col  divide-y-2 divide-primary-200 ">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={product.isDisabled ? "opacity-50" : undefined}
          >
            <ListItem
              hideCartIndicator
              product={product}
              onClick={() => void showModal(EditProductFlow, { product })}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
