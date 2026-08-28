"use client";

import { useEffect, useRef } from "react";
import { HiSearch, HiX } from "react-icons/hi";

import {
  clearQuery,
  closeSearch,
  searchOpen,
  searchQuery,
} from "@/state/shopSearch";
import { useSignals } from "@preact/signals-react/runtime";

/**
 * The search input. Opens on its own row under the welcome text and takes focus
 * immediately so the touch keyboard rises with it.
 */
export const SearchField = () => {
  useSignals();
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpen = searchOpen.value;

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <form
      role="search"
      className="px-5 md:px-12"
      onSubmit={(event) => {
        // Submitting dismisses the keyboard but keeps the filter in place.
        event.preventDefault();
        inputRef.current?.blur();
      }}
    >
      <div
        className="flex h-12 items-center gap-3 rounded-xl border-2 border-primary-500 bg-white px-4 md:h-16 md:px-6"
        onClick={() => inputRef.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === "Escape") closeSearch();
        }}
      >
        <HiSearch className="shrink-0 text-xl text-primary-500 md:text-2xl" />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          aria-label="Search products"
          placeholder="Search products"
          value={searchQuery.value}
          onChange={(event) => (searchQuery.value = event.target.value)}
          className="hide-search-cancel min-w-0 grow bg-inherit text-lg font-medium text-neutral-800 outline-none placeholder:font-normal placeholder:text-neutral-400 md:text-2xl"
        />
        {searchQuery.value && (
          <button
            type="button"
            aria-label="Clear search text"
            // Keep focus (and the keyboard) on the input while clearing.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              clearQuery();
              inputRef.current?.focus();
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 md:h-8 md:w-8 md:text-xl"
          >
            <HiX />
          </button>
        )}
      </div>
    </form>
  );
};
