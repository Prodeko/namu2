"use client";

import { type ComponentPropsWithoutRef } from "react";

import { type CartProduct } from "@/common/types";
import { type Section } from "@/common/types";
import { useSyncActiveSection } from "@/state/useSyncActiveSection";

import { ProductModal } from "./ProductModal";
import { SectionTitle } from "./SectionTitle";

type SectionProps = ComponentPropsWithoutRef<"section">;

export interface Props extends SectionProps {
  section: Section;
  items: CartProduct[];
}

export const ProductSection = ({ section, items, ...props }: Props) => {
  const ref = useSyncActiveSection(section);

  return (
    <section
      {...props}
      ref={ref}
      id={section.id}
      className="flex flex-col gap-2"
    >
      <SectionTitle className="px-12" title={section.name} />
      <ul className="flex flex-col divide-y-2 divide-neutral-200">
        {items.map((item) => (
          <ProductModal key={item.id} product={item} />
        ))}
      </ul>
    </section>
  );
};
