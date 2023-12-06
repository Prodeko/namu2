import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

const buttonStyles = cva("px-4 py-2 text-2xl", {
  variants: {
    intent: {
      active: "bg-primary-200 text-primary-500 rounded-xl font-semibold",
      regular: "font-medium text-neutral-700",
    },
  },
  defaultVariants: {
    intent: "regular",
  },
});

export type ButtonVariants = VariantProps<typeof buttonStyles>;

interface Props extends ButtonProps, ButtonVariants {
  text: string;
}

export const NavButton = ({ intent, text, ...props }: Props) => {
  return (
    <button type="button" className={buttonStyles({ intent })} {...props}>
      {text}
    </button>
  );
};
