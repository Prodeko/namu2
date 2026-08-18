"use client";

import { type ReactNode, useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { animated, useSpring } from "@react-spring/web";

const AnimatedContent = animated(Dialog.Content);
const AnimatedOverlay = animated(Dialog.Overlay);

interface ModalShellProps {
  /** Whether the modal should be visible. Drives enter/leave animations. */
  open: boolean;
  /** Called once the leave animation has finished, so the host can unmount. */
  onExited: () => void;
  /** Active page's dismissibility — gates the X button, outside-click and ESC. */
  dismissible: boolean;
  /** Invoked when the user dismisses via X, outside-click or ESC. */
  onDismiss: () => void;
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  /** Force the bottom-sheet presentation on every viewport. */
  forceBottomSheet?: boolean;
  currentIndex: number;
  pageCount: number;
  children: ReactNode;
}

const containerBase =
  "fixed z-30 flex flex-col gap-6 bg-neutral-50 shadow-xl drop-shadow focus:outline-none";
const desktopPosition =
  "left-1/2 top-1/2 max-h-[85vh] w-[90vw] overflow-y-auto rounded-2xl px-8 py-8 lg:w-[60vw] xl:w-[40vw]";
const mobilePosition =
  "inset-x-0 bottom-0 max-h-[90vh] w-full overflow-y-auto rounded-t-[35px] px-5 pt-6 pb-safe";
const centeredSheetPosition =
  "bottom-0 left-1/2 max-h-[90vh] w-full max-w-screen-lg overflow-y-auto rounded-t-[35px] px-8 pt-6 pb-safe";

export const ModalShell = ({
  open,
  onExited,
  dismissible,
  onDismiss,
  title,
  subtitle,
  showProgress,
  forceBottomSheet,
  currentIndex,
  pageCount,
  children,
}: ModalShellProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // A forced sheet on lg+ becomes a centered 60vw variant; the plain mobile
  // case (below 768px) stays a full-width sheet.
  const useBottomSheet = forceBottomSheet || !isDesktop;
  const centeredSheet =
    useBottomSheet && Boolean(forceBottomSheet) && isLargeScreen;

  const positionClass = !useBottomSheet
    ? desktopPosition
    : centeredSheet
      ? centeredSheetPosition
      : mobilePosition;

  let openStyle: { opacity: number; transform: string };
  let closedStyle: { opacity: number; transform: string };
  if (!useBottomSheet) {
    openStyle = { opacity: 1, transform: "translate(-50%, -50%) scale(1)" };
    closedStyle = {
      opacity: 0,
      transform: "translate(-50%, -48%) scale(0.96)",
    };
  } else if (centeredSheet) {
    openStyle = { opacity: 1, transform: "translate(-50%, 0%)" };
    closedStyle = { opacity: 0, transform: "translate(-50%, 100%)" };
  } else {
    openStyle = { opacity: 1, transform: "translateY(0%)" };
    closedStyle = { opacity: 0, transform: "translateY(100%)" };
  }

  const containerSpring = useSpring({
    from: closedStyle,
    to: open ? openStyle : closedStyle,
    config: { mass: 0.4, tension: 300, friction: 26 },
    onRest: () => {
      if (!open) {
        setMounted(false);
        onExited();
      }
    },
  });

  const overlaySpring = useSpring({ opacity: open ? 1 : 0 });

  const handleDismissAttempt = (event: Event) => {
    if (!dismissible) {
      event.preventDefault();
      return;
    }
    onDismiss();
  };

  const hasHeaderText = Boolean(title || subtitle);

  return (
    <Dialog.Root open={mounted} onOpenChange={() => {}}>
      <Dialog.Portal>
        <AnimatedOverlay
          style={overlaySpring}
          className="fixed inset-0 z-30 bg-black bg-opacity-25"
        />
        <AnimatedContent
          style={containerSpring}
          className={cn(containerBase, positionClass)}
          onInteractOutside={handleDismissAttempt}
          onEscapeKeyDown={handleDismissAttempt}
          aria-describedby={undefined}
        >
          <VisuallyHidden.Root asChild>
            <Dialog.Title>{title ?? "Dialog"}</Dialog.Title>
          </VisuallyHidden.Root>

          {showProgress && pageCount > 1 && (
            <div className="flex w-full items-center justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: dots are a fixed positional sequence
                  key={i}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === currentIndex
                      ? "w-6 bg-primary-400"
                      : i < currentIndex
                        ? "w-2 bg-primary-300"
                        : "w-2 bg-neutral-300",
                  )}
                />
              ))}
            </div>
          )}

          {(hasHeaderText || dismissible) && (
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                {title && (
                  <p className="text-xl font-bold text-primary-400 md:text-3xl">
                    {title}
                  </p>
                )}
                {subtitle && (
                  <h2 className="text-base text-neutral-500 md:text-xl">
                    {subtitle}
                  </h2>
                )}
              </div>
              {dismissible && (
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onDismiss}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-400 bg-primary-50 text-lg text-primary-400 md:h-12 md:w-12 md:text-2xl"
                >
                  <HiX />
                </button>
              )}
            </div>
          )}

          {children}
        </AnimatedContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
