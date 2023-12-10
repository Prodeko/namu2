import { cva } from "class-variance-authority";
import { type ComponentProps } from "react";

type variantname = "active" | "regular";

const buttonStyles = cva("w-full px-6 py-3 text-center text-3xl", {
  variants: {
    intent: {
      active: "border-b-2 border-black font-bold text-black",
      regular: "border-b-0 text-gray-700",
    },
  },
  defaultVariants: {
    intent: "regular",
  },
});

type WishNavProps = ComponentProps<"button">;

export interface Props extends WishNavProps {
  name: string;
  intent: variantname;
}

export const WishNavButton = ({ name, intent, ...props }: Props) => {
  return (
    <button type="button" className={buttonStyles({ intent })} {...props}>
      {name}
    </button>
  );
};
