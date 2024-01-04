import { type Section } from "@/common/types";
import { signal } from "@preact/signals-react";

export const sections = {
  featured: {
    id: "section-featured",
    name: "Featured",
  },
  drinks: {
    id: "section-drinks",
    name: "Drinks",
  },
  snacks: {
    id: "section-snacks",
    name: "Snacks",
  },
  food: {
    id: "section-food",
    name: "Food",
  },
} satisfies Record<string, Section>;

export const activeSection = signal<string>(sections.featured.id);
