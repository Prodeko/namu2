import { type ComponentProps } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";

type DropDownListProps = ComponentProps<"text">;

interface Props extends DropDownListProps {
  placeHolderText: string;
}

export const DropDownList = ({ placeHolderText, ...props }: Props) => {
  return (
    <text
      className="relative flex w-full items-center rounded-2xl bg-white px-7 py-4 text-2xl text-gray-400 shadow-md"
      {...props}
    >
      {placeHolderText}
      <HiOutlineChevronDown className="absolute right-7 text-black" />
    </text>
  );
};
