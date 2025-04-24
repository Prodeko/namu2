"use client";

import { ComponentPropsWithRef, useEffect, useRef, useState } from "react";
import { HiCheck, HiChevronRight } from "react-icons/hi";

import { cn } from "@/lib/utils";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

type Props = ComponentPropsWithRef<"div">;
const AnimatedSpan = animated("span");
const AnimatedButton = animated("button");

export const Slider = ({ className, ...props }: Props) => {
  const [locked, setLocked] = useState(false); // State to handle the lock
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Spring animations for the button and text
  const [{ x }, set] = useSpring(() => ({ x: 0 }));
  const [textAnimation, textApi] = useSpring(() => ({
    translateY: "-50%",
    opacity: 1,
  }));

  useEffect(() => {
    if (locked && containerRef.current) {
      const event = new Event("submit", { bubbles: true });
      containerRef.current.dispatchEvent(event);
      setTimeout(() => {
        resetButtonPosition();
      }, 1000);
    }
  }, [locked]);

  const resetButtonPosition = () => {
    set({ x: 0 });
    setLocked(false);
    textApi.start({ translateY: "-50%", opacity: 1 });
  };
  // Drag gesture binding
  const bind = useDrag(({ down, movement: [mx], cancel }) => {
    if (containerRef.current && buttonRef.current) {
      const containerStyles = window.getComputedStyle(containerRef.current);
      const containerPadding =
        parseFloat(containerStyles.paddingLeft) +
        parseFloat(containerStyles.paddingRight);
      const containerWidth = containerRef.current.offsetWidth;
      const buttonWidth = buttonRef.current.offsetWidth;
      const maxDrag = containerWidth - buttonWidth - containerPadding;
      const lockThreshold = 16;

      if (mx > maxDrag - lockThreshold) {
        set({ x: maxDrag });
        if (!down) {
          setLocked(true); // Lock the button
          cancel();
        }
        textApi.start({ translateY: "-250%", opacity: 0 }); // Move out original text
      } else if (mx > 0) {
        set({ x: down ? mx : 0, immediate: down });
        textApi.start({ translateY: "-50%", opacity: 1 }); // Reset text position
      }
    }
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative z-20 h-fit w-full max-w-[100vw] overflow-hidden rounded-full transition-all landscape:max-w-[50vw]",
        locked ? "bg-primary-300" : "bg-neutral-300",
        "p-1.5 text-lg font-semibold shadow-xl md:p-2 md:text-xl",
        className,
      )}
      {...props}
    >
      <AnimatedButton
        ref={buttonRef}
        {...bind()}
        style={{ x, touchAction: "none" }}
        type="submit"
        className="relative z-20 flex cursor-grab items-center justify-center rounded-full bg-neutral-50 p-4 shadow-lg"
      >
        {locked ? (
          <HiCheck size={"2.4rem"} className="text-neutral-700" />
        ) : (
          <HiChevronRight className="text-3xl text-neutral-700 md:text-4xl" />
        )}
      </AnimatedButton>
      <AnimatedSpan
        style={textAnimation}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-neutral-500"
      >
        Slide to purchase
      </AnimatedSpan>
      <AnimatedSpan
        style={{
          translateY: textAnimation.translateY.to(
            (y) => `${parseFloat(y) + 200}%`,
          ),
          opacity: textAnimation.opacity.to((o) => 1 - o),
        }}
        className="absolute inset-x-0 top-1/2 translate-y-1/4 text-center text-neutral-500"
      >
        Release to purchase
      </AnimatedSpan>
    </div>
  );
};
