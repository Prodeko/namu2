"use client";

import { VariantProps, cva } from "class-variance-authority";
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { animated, useSpring } from "@react-spring/web";

const AnimatedDialog = animated(Dialog.Content);
const AnimatedOverlay = animated(Dialog.Overlay);

const styles = cva("fixed z-20 flex w-full flex-col", {
  variants: {
    intent: {
      full: " top-8 h-[calc(100%-2rem)] overflow-hidden rounded-t-2xl",
      bottom: "bottom-0 gap-6 rounded-t-xl bg-white py-12",
    },
  },
});

interface Props
  extends Partial<React.FC<Dialog.DialogProps>>,
    VariantProps<typeof styles> {
  TriggerComponent: JSX.Element;
  children: ReactNode;
}

export interface ModalRefActions {
  openContainer: () => void;
  closeContainer: () => void;
  toggleContainer: () => void;
}

export const AnimatedModal = forwardRef(
  (props: Props, ref: ForwardedRef<unknown>) => {
    const { TriggerComponent, children, intent, ...restProps } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const toggleContainer = () => setOpen(!open);

    const containerAnimation = useSpring({
      transform: open ? "translate(0, 0%)" : "translate(0, 100%)",
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

    useImperativeHandle<unknown, ModalRefActions>(ref, () => ({
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
            className={styles({ intent })}
          >
            {children}
          </AnimatedDialog>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);
