"use client";

import type { FC, ReactNode } from "react";

import NiceModal from "@ebay/nice-modal-react";

/**
 * Thin wrapper around `@ebay/nice-modal-react` so call sites never touch the
 * library directly — this keeps the dependency swappable and the API tailored
 * to our paged modal system.
 */

/** Mount once near the app root so modals can be opened from anywhere. */
export const ModalProvider = ({ children }: { children: ReactNode }) => (
  <NiceModal.Provider>{children}</NiceModal.Provider>
);

/**
 * A modal flow created with {@link createModalFlow}. The phantom `__result`
 * field carries the resolve type through to {@link showModal} without ever
 * existing at runtime.
 */
export type ModalFlow<TProps, TResult> = FC<TProps> & {
  readonly __result?: TResult;
};

/**
 * Define a modal flow. `render` returns the `<Modal>` tree for the flow and
 * receives the props later passed to {@link showModal}.
 */
export const createModalFlow = <
  TProps extends Record<string, unknown> = Record<string, never>,
  TResult = void,
>(
  render: (props: TProps) => ReactNode,
): ModalFlow<TProps, TResult> => {
  return NiceModal.create((props: TProps) => <>{render(props)}</>) as ModalFlow<
    TProps,
    TResult
  >;
};

/**
 * Open a flow programmatically (from a click handler, a `useEffect`, or the
 * `.then()` of an API call). Resolves to the value passed to `nav.resolve(...)`,
 * or `undefined` if the user dismisses the modal.
 */
export const showModal = async <TProps, TResult>(
  flow: ModalFlow<TProps, TResult>,
  props?: TProps,
): Promise<TResult | undefined> => {
  return (await NiceModal.show(flow, props as TProps)) as TResult | undefined;
};
