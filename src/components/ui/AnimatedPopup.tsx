"use client";

import {
  type ForwardedRef,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { animated, useSpring } from "@react-spring/web";

const AnimatedDialog = animated(Dialog.Content);
const AnimatedOverlay = animated(Dialog.Overlay);

interface Props extends Partial<React.FC<Dialog.DialogProps>> {
  TriggerComponent: ReactNode;
  children: ReactNode;
}

export interface PopupRefActions {
  openContainer: () => void;
  closeContainer: () => void;
  toggleContainer: () => void;
}

export const AnimatedPopup = forwardRef(
  (props: Props, ref: ForwardedRef<unknown>) => {
    const { TriggerComponent, children, ...restProps } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const toggleContainer = () => setOpen((prev) => !prev);

    const containerAnimation = useSpring({
      transform: open ? "translate(-50%, -50%)" : "translate(-50%, -50%)",
      opacity: open ? 1 : 0,
      onRest: () => {
        if (!open && isAnimating) {
          setIsAnimating(false);
        }
      },
      onStart: () => {
        if (open) setIsAnimating(true);
      },
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
            className="fixed left-1/2 top-1/2 z-20 flex h-auto w-[90vw] items-center justify-center rounded-2xl bg-neutral-50 lg:w-[80vw] xl:w-fit"
          >
            {children}
          </AnimatedDialog>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);
