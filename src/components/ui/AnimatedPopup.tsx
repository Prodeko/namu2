"use client";

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

interface Props extends Partial<React.FC<Dialog.DialogProps>> {
  TriggerComponent: JSX.Element;
  children: ReactNode;
}

export interface PopufRefActions {
  openContainer: () => void;
  closeContainer: () => void;
  toggleContainer: () => void;
}

export const AnimatedPopup = forwardRef(
  (props: Props, ref: ForwardedRef<unknown>) => {
    const { TriggerComponent, children, ...restProps } = props;
    const [open, setOpen] = useState<boolean>(false);
    const containerAnimation = useSpring({
      transform: open ? "translate(-50%, -40%)" : "translate(-50%, -50%)",
      opacity: open ? 1 : 0.2,
    });
    const overlayAnimation = useSpring({
      opacity: open ? 1 : 0,
    });
    const toggleContainer = () => setOpen(!open);

    useImperativeHandle<unknown, PopufRefActions>(ref, () => {
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
            className={
              "fixed left-1/2 top-1/2 z-20 flex h-auto w-1/2 items-center justify-center"
            }
          >
            {children}
          </AnimatedDialog>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);
