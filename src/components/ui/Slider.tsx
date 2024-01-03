import { ComponentPropsWithRef, useRef, useState } from "react";
import { HiCheck, HiChevronRight } from "react-icons/hi";

import { cn } from "@/lib/utils";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

type Props = ComponentPropsWithRef<"div">;

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
        setLocked(true); // Lock the button
        textApi.start({ translateY: "-250%", opacity: 0 }); // Move out original text
      } else if (mx < 0) {
        set({ x: 0 });
        setLocked(false);
        textApi.start({ translateY: "-50%", opacity: 1 }); // Reset text position
      } else {
        set({ x: down ? mx : 0, immediate: down });
        setLocked(false);
        textApi.start({ translateY: "-50%", opacity: 1 }); // Reset text position
      }
    }
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-full transition-all ",
        locked ? "bg-primary-300" : "bg-neutral-300", // Change background color
        "p-2 text-xl font-semibold shadow-xl",
        className,
      )}
      {...props}
    >
      <animated.button
        ref={buttonRef}
        {...bind()}
        style={{ x, touchAction: "none" }}
        type="submit"
        className="relative z-20 flex cursor-grab items-center justify-center rounded-full bg-neutral-50 p-4 shadow-lg"
      >
        {locked ? (
          <HiCheck size={"2.4rem"} className="text-neutral-700" />
        ) : (
          <HiChevronRight size={"2.4rem"} className="text-neutral-700" />
        )}
      </animated.button>
      <animated.span
        style={textAnimation}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 text-neutral-500"
      >
        Slide to purchase
      </animated.span>
      <animated.span
        style={{
          translateY: textAnimation.translateY.to(
            (y) => `${parseFloat(y) + 200}%`,
          ),
          opacity: textAnimation.opacity.to((o) => 1 - o),
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 text-neutral-500"
      >
        Release to purchase
      </animated.span>
    </div>
  );
};
