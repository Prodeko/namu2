"use client";

import { HiSearch, HiX } from "react-icons/hi";

import { IconButton } from "@/components/ui/Buttons/IconButton";
import { closeSearch, openSearch, searchOpen } from "@/state/shopSearch";
import { useSignals } from "@preact/signals-react/runtime";

/**
 * Opens and closes the shop search. Sits on the right of the welcome row,
 * deliberately not in the top navigation.
 */
export const SearchTrigger = () => {
  useSignals();
  const isOpen = searchOpen.value;

  return (
    <IconButton
      buttonType="button"
      type="button"
      sizing="md"
      Icon={isOpen ? HiX : HiSearch}
      className="shrink-0 bg-primary-500 text-white"
      aria-label={isOpen ? "Close search" : "Search products"}
      aria-expanded={isOpen}
      onClick={() => (isOpen ? closeSearch() : openSearch())}
    />
  );
};
