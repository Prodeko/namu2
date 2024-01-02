import { ComponentPropsWithRef, useRef, useState } from "react";
import { HiChevronRight } from "react-icons/hi";

import { cn } from "@/lib/utils";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

type Props = ComponentPropsWithRef<"div">;

export const Slider = ({ className, ...props }: Props) => {
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Spring animation for the button
  const [{ x }, set] = useSpring(() => ({ x: 0 }));

  // Drag gesture binding
  const bind = useDrag(({ down, movement: [mx] }) => {
    if (containerRef.current && buttonRef.current) {
      const containerStyles = window.getComputedStyle(containerRef.current);
      const containerPadding =
        parseFloat(containerStyles.paddingLeft) +
        parseFloat(containerStyles.paddingRight);
      const containerWidth = containerRef.current.offsetWidth;
      const buttonWidth = buttonRef.current.offsetWidth;
      const maxDrag = containerWidth - buttonWidth - containerPadding;

      if (mx > maxDrag) {
        set({ x: maxDrag });
      } else if (mx < 0) {
        set({ x: 0 });
      } else {
        set({ x: down ? mx : 0, immediate: down });
      }
    }

    setDragging(down);
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full rounded-full bg-neutral-300 p-2 text-xl font-semibold shadow-xl",
        className,
      )}
      {...props}
    >
      <animated.button
        ref={buttonRef}
        {...bind()}
        style={{ x }}
        type="submit"
        className="flex cursor-grab items-center justify-center rounded-full bg-neutral-50 p-4 shadow-lg"
      >
        <HiChevronRight size={"2.4rem"} className="text-neutral-700" />
      </animated.button>
      {!dragging && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500">
          {"Slide to purchase"}
        </span>
      )}
    </div>
  );
};
