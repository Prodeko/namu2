"use client";

import { type ComponentPropsWithoutRef } from "react";

import { type Section } from "@/common/types";
import { type ClientProduct } from "@/common/types";
import { useSyncActiveSection } from "@/state/useSyncActiveSection";

import { ProductList } from "./ProductList";
import { SectionTitle } from "./SectionTitle";

type SectionProps = ComponentPropsWithoutRef<"section">;

export interface Props extends SectionProps {
  section: Section;
  items: ClientProduct[];
}

export const ProductSection = ({ section, items, ...props }: Props) => {
  const ref = useSyncActiveSection(section);

  if (items.length === 0) return null;

  return (
    <section
      {...props}
      ref={ref}
      id={section.id}
      className="flex flex-col gap-2"
    >
      <SectionTitle className="px-5 md:px-12" title={section.name} />
      <ProductList items={items} />
    </section>
  );
};
