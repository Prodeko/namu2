"use client";

import { cva } from "class-variance-authority";
import { type ComponentProps } from "react";

import { shopCatalogueID, shopNavID } from "@/common/constants";
import { activeSection } from "@/state/activeSection";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

type ButtonProps = ComponentProps<"button">;

const buttonStyles = cva("px-4 py-2 text-2xl", {
  variants: {
    intent: {
      active: "rounded-xl bg-primary-200 font-semibold text-primary-500",
      regular: "font-medium text-neutral-700",
    },
  },
  defaultVariants: {
    intent: "regular",
  },
});

interface Props extends ButtonProps {
  text: string;
  sectionId: string;
}

export const isScrolling = signal(false);
const currentTimeout = signal<NodeJS.Timeout | null>(null);

const scrollToSection = (sectionId: string) => {
  if (currentTimeout.value) clearTimeout(currentTimeout.value);
  isScrolling.value = true;
  const sectionElement = document.getElementById(sectionId);
  if (sectionElement) {
    const shopCatalogueElement = document.getElementById(shopCatalogueID);
    const padding = shopCatalogueElement
      ? parseInt(window.getComputedStyle(shopCatalogueElement).paddingTop, 10)
      : 40;
    const navbarElement = document.getElementById(shopNavID);
    const navbarHeight = navbarElement
      ? parseInt(window.getComputedStyle(navbarElement).height, 10)
      : 0;
    const sectionOffset = sectionElement.offsetTop;
    const offsetPosition = sectionOffset - navbarHeight - padding;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
  const newTimeout = setTimeout(() => {
    isScrolling.value = false;
  }, 1000);

  currentTimeout.value = newTimeout;
};

export const NavButton = ({ sectionId, text, ...props }: Props) => {
  useSignals();

  return (
    <button
      onClick={() => {
        activeSection.value = sectionId;
        scrollToSection(sectionId);
      }}
      type="button"
      className={buttonStyles({
        intent: activeSection.value === sectionId ? "active" : "regular",
      })}
      {...props}
    >
      {text}
    </button>
  );
};
