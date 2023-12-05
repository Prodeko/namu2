import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

const buttonStyles = cva("text-2xl px-4 py-2", {
  variants: {
    intent: {
      active: "bg-pink-200 text-pink-500 rounded-xl font-semibold",
      regular: "text-slate-700 font-medium",
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
