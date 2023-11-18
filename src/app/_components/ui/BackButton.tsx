import { type ComponentProps } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";

type GoBackProps = ComponentProps<"a">;

export const GoBack = ({ ...props }: GoBackProps) => {
  return (
    <a
      className="flex w-24 items-center gap-2 whitespace-nowrap border-b-2 border-pink-400"
      {...props}
    >
      <HiArrowNarrowLeft className="text-pink-400" />
      <span className="text-xl text-pink-400">Go Back</span>
    </a>
  );
};
