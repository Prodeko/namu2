import { type ComponentProps } from "react";

import { type CartProduct } from "@/common/types";
import { type Section } from "@/common/types";

import { ProductModal } from "./ProductModal";
import { SectionTitle } from "./SectionTitle";

type SectionProps = ComponentProps<"section">;

export interface Props extends SectionProps {
  section: Section;
  items: CartProduct[];
}

export const ProductSection = ({ section, items, ...props }: Props) => {
  return (
    <section {...props} id={section.id} className="flex flex-col gap-2">
      <SectionTitle className="px-12" title={section.name} />
      <ul className="flex flex-col divide-y-2 divide-neutral-200">
        {items.map((item) => (
          <ProductModal key={item.id} product={item} />
        ))}
      </ul>
    </section>
  );
};
