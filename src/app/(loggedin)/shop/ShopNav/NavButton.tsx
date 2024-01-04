import { cva } from "class-variance-authority";
import { type ComponentProps } from "react";

import { shopCatalogueID, shopNavID } from "@/common/constants";
import { activeSection } from "@/state/activeSection";
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

const scrollToSection = (sectionId: string) => {
  const sectionElement = document.getElementById(sectionId);
  const shopCatalogueElement = document.getElementById(shopCatalogueID);
  const padding = shopCatalogueElement
    ? parseInt(window.getComputedStyle(shopCatalogueElement).paddingTop, 10)
    : 40;
  if (sectionElement) {
    const navbarHeight = document.getElementById(shopNavID)?.offsetHeight || 0;
    const offsetPosition = sectionElement.offsetTop - navbarHeight - padding;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
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
