"use client";

import { type ComponentPropsWithoutRef } from "react";

import { type Section } from "@/common/types";
import { type ClientProduct } from "@/common/types";
import { useAddToCart } from "@/state/useAddToCart";
import { useSyncActiveSection } from "@/state/useSyncActiveSection";

import { ListItem } from "./ListItem";
import { SectionTitle } from "./SectionTitle";

type SectionProps = ComponentPropsWithoutRef<"section">;

export interface Props extends SectionProps {
  section: Section;
  items: ClientProduct[];
}

export const ProductSection = ({ section, items, ...props }: Props) => {
  const ref = useSyncActiveSection(section);
  const addToCart = useAddToCart();

  if (items.length === 0) return null;

  return (
    <section
      {...props}
      ref={ref}
      id={section.id}
      className="flex flex-col gap-2"
    >
      <SectionTitle className="px-5 md:px-12" title={section.name} />
      <ul className="flex flex-col divide-y-2 divide-neutral-200">
        {items.map((item) => (
          <ListItem
            key={item.id}
            product={item}
            onClick={() => addToCart(item)}
          />
        ))}
      </ul>
    </section>
  );
};
