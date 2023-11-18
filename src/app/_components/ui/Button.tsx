import { type VariantProps, cva } from "class-variance-authority";
import { type ComponentProps } from "react";
import { type IconType } from "react-icons";

type ButtonProps = ComponentProps<"button">;

const buttonStyles = cva(
  "font-semibold text-2xl flex items-center justify-center gap-2 px-8 py-4",
  {
    variants: {
      intent: {
        admin: "bg-pink-100 rounded-lg text-pink-400",
        regular: "bg-pink-400 rounded-full text-pink-50",
      },
      fullwidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      intent: "regular",
    },
  },
);

export interface Props extends ButtonProps, VariantProps<typeof buttonStyles> {
  text: string;
  fullwidth?: boolean;
  Icon?: IconType;
}

export const Button = ({ text, Icon, intent, fullwidth, ...props }: Props) => {
  return (
    <button {...props} className={buttonStyles({ intent, fullwidth })}>
      <span>{text}</span>
      {Icon && <span>{<Icon />}</span>}
    </button>
  );
};
