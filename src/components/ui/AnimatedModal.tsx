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

const styles = cva("", {
  variants: {
    intent: {
      full: "fixed top-8 z-20 flex h-[calc(100%-2rem)] w-full flex-col overflow-hidden rounded-t-2xl",
      bottom:
        "fixed bottom-0 z-20 flex w-full flex-col gap-6 rounded-t-xl bg-white py-12",
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
    const containerAnimation = useSpring({
      transform: open ? "translateY(0)" : "translateY(100%)",
    });
    const overlayAnimation = useSpring({
      opacity: open ? 1 : 0,
    });
    const toggleContainer = () => setOpen(!open);

    useImperativeHandle<unknown, ModalRefActions>(ref, () => {
      return {
        openContainer() {
          setOpen(true);
        },
        closeContainer() {
          setOpen(false);
        },
        toggleContainer() {
          toggleContainer();
        },
      };
    });

    return (
      <Dialog.Root {...restProps} open={open} onOpenChange={setOpen}>
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
