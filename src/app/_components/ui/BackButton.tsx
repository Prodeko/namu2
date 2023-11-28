import { type ComponentProps } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";

type BackButtonProps = ComponentProps<"a">;

export const BackButton = ({ ...props }: BackButtonProps) => {
  return (
    <a
      className="flex items-center gap-2 whitespace-nowrap border-b-2 border-pink-400 text-pink-400 text-xl self-start"
      {...props}
    >
      <HiArrowNarrowLeft />
      <span>Go Back</span>
    </a>
  );
};
