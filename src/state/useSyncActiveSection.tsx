"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { isScrolling } from "@/app/(loggedin)/shop/ShopNav/NavButton";
import { headerID, shopCatalogueID, shopNavID } from "@/common/constants";
import { Section } from "@/common/types";
import { useSignals } from "@preact/signals-react/runtime";

import { activeSection } from "./activeSection";

/**
 * Synchorizes the navigation tab with the section that is currently in view
 *
 * @param section - The section to synchronize with
 * @returns Reference to be passed to the section element
 */
export const useSyncActiveSection = (section: Section) => {
  useSignals();
  const [visibleHeaderHeight, setVisibleHeaderHeight] = useState<number>(0);

  const updateVisibleHeaderHeight = () => {
    const headerEl = document.getElementById(headerID);
    const shopNavEl = document.getElementById(shopNavID);

    if (headerEl && shopNavEl) {
      const headerRect = headerEl.getBoundingClientRect();
      const shopNavRect = shopNavEl.getBoundingClientRect();
      const shopCatalogueElement = document.getElementById(shopCatalogueID);
      const padding = shopCatalogueElement
        ? parseInt(window.getComputedStyle(shopCatalogueElement).paddingTop, 10)
        : 40;

      // If the header top is above the viewport (negative value), the visible part is only the shopNav
      const visibleHeight =
        headerRect.top < 0
          ? shopNavRect.height + padding
          : shopNavRect.height + padding + headerRect.height;
      setVisibleHeaderHeight(visibleHeight);
    }
  };

  useEffect(() => {
    updateVisibleHeaderHeight();
    window.addEventListener("resize", updateVisibleHeaderHeight);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateVisibleHeaderHeight);
    };
  }, [updateVisibleHeaderHeight]);

  const viewPortHeight = window.innerHeight;
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `-${visibleHeaderHeight}px 0px -${
      viewPortHeight - visibleHeaderHeight
    }px 0px`,
  });

  useEffect(() => {
    if (inView && !isScrolling.value) {
      activeSection.value = section.id;
    }
  }, [inView, section]);

  return ref;
};
