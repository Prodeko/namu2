import { type ComponentProps } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";

type BackButtonProps = ComponentProps<"a">;

export const BackButton = ({ ...props }: BackButtonProps) => {
  return (
    <a
      className="border-primary-400 text-primary-400 flex items-center gap-2 self-start whitespace-nowrap border-b-2 text-xl"
      {...props}
    >
      <HiArrowNarrowLeft />
      <span>Go Back</span>
    </a>
  );
};
