"use client";

import { cva } from "class-variance-authority";
import React, { type ReactNode, useImperativeHandle, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { animated, useSpring } from "@react-spring/web";

const AnimatedDialog = animated(Dialog.Content);
const AnimatedOverlay = animated(Dialog.Overlay);

interface Props extends Partial<React.FC<Dialog.DialogProps>> {
  TriggerComponent: ReactNode;
  children: ReactNode;
  ref?: React.RefObject<unknown>;
  style?: "default" | "RFIDInstructions";
}

export interface PopupRefActions {
  openContainer: () => void;
  closeContainer: () => void;
  toggleContainer: () => void;
}

const popupStyles = cva(
  "fixed left-1/2 z-20 flex h-auto translate-y-1/2 items-center justify-center  bg-neutral-50 lg:w-[60vw] xl:w-fit",
  {
    variants: {
      style: {
        default: "top-1/2 w-[90vw] rounded-2xl",
        RFIDInstructions:
          "top-0 w-full rounded-bl-[50%_15%] rounded-br-[50%_15%]",
      },
    },
  },
);

const transformStyles = cva(" ", {
  variants: {
    style: { default: {}, RFIDInstructions: {} },
    open: { true: {}, false: {} },
  },
  compoundVariants: [
    {
      style: "default",
      open: true,
      class: "translate(-50%, -50%)",
    },
    {
      style: "default",
      open: false,
      class: "translate(-50%, 100%)",
    },
    {
      style: "RFIDInstructions",
      open: true,
      class: "translate(-50%, -10%)",
    },
    {
      style: "RFIDInstructions",
      open: false,
      class: "translate(-50%, -100%)",
    },
  ],
});

export const AnimatedPopup = ({
  ref = React.createRef(),
  style = "default",
  ...props
}: Props) => {
  const { TriggerComponent, children, ...restProps } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const toggleContainer = () => setOpen((prev) => !prev);

  const containerAnimation = useSpring({
    transform: transformStyles({ style, open }),
    opacity: open ? 1 : 0,
    onRest: () => {
      if (!open && isAnimating) {
        setIsAnimating(false);
      }
    },
    onStart: () => {
      if (open) setIsAnimating(true);
    },
    config: { mass: 0.4, tension: 300, friction: 16 },
  });

  const overlayAnimation = useSpring({
    opacity: open ? 1 : 0,
  });

  useImperativeHandle<unknown, PopupRefActions>(ref, () => ({
    openContainer() {
      setOpen(true);
    },

    closeContainer() {
      setIsAnimating(true);
      setOpen(false);
    },

    toggleContainer() {
      if (open) {
        setIsAnimating(true); // Ensure isAnimating is true when closing
        setOpen(false);
      } else {
        setOpen(true);
      }
    },
  }));

  return (
    <Dialog.Root
      {...restProps}
      open={open || isAnimating}
      onOpenChange={setOpen}
    >
      <Dialog.Trigger asChild onClick={toggleContainer}>
        {TriggerComponent}
      </Dialog.Trigger>
      <Dialog.Portal>
        <AnimatedOverlay
          style={overlayAnimation}
          className="fixed inset-0 z-20 bg-black bg-opacity-25"
        />
        <AnimatedDialog
          style={containerAnimation}
          className={popupStyles({ style })}
          onInteractOutside={toggleContainer}
          aria-describedby={undefined}
        >
          <VisuallyHidden.Root asChild>
            <Dialog.Title>Popup</Dialog.Title>
          </VisuallyHidden.Root>
          {children}
        </AnimatedDialog>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
