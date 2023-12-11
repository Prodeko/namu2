import { ComponentPropsWithRef } from "react";
import { HiChevronRight } from "react-icons/hi";

import { cn } from "@/lib/utils";

type Props = ComponentPropsWithRef<"div">;

const Slider = ({ className, ...props }: Props) => {
  return (
    <div
      className={cn(
        "relative w-full rounded-full bg-neutral-300 p-2 text-xl font-semibold shadow-xl",
        className,
      )}
    >
      <button
        type="submit"
        className="flex items-center justify-center rounded-full bg-neutral-50 p-4 shadow-lg"
      >
        <HiChevronRight size={"2.4rem"} className="text-neutral-700" />
      </button>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-500">
        {"Slide to purchase"}
      </span>
    </div>
  );
};

export default Slider;
