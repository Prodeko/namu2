"use client";

import { createContext, useContext } from "react";

export type NavDirection = "forward" | "backward";

/**
 * Navigation surface shared by action buttons and page content.
 * Obtained via {@link useModalNav}.
 */
export interface ModalNav<TResult = unknown> {
  /** Advance to the next page (no-op on the last page). */
  next: () => void;
  /** Go back to the previous page (no-op on the first page). */
  back: () => void;
  /** Jump to a page by its `id` (set on `Modal.Page`). */
  goTo: (id: string) => void;
  /** Close the modal, resolving the `showModal` promise to `undefined`. */
  close: () => void;
  /** Close the modal, resolving the `showModal` promise to `value`. */
  resolve: (value: TResult) => void;
  /** Zero-based index of the active page. */
  currentIndex: number;
  /** Total number of pages. */
  pageCount: number;
}

export const ModalNavContext = createContext<ModalNav | null>(null);

export const useModalNav = <TResult = unknown,>(): ModalNav<TResult> => {
  const ctx = useContext(ModalNavContext);
  if (!ctx) {
    throw new Error("useModalNav must be used within a <Modal>");
  }
  return ctx as ModalNav<TResult>;
};
