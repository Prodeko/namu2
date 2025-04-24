import { VariantProps, cva } from "class-variance-authority";
import { type ComponentProps } from "react";

const buttonStyles = cva(
  "w-full px-3 py-2 text-center text-xl md:px-6 md:py-3 md:text-2xl",
  {
    variants: {
      intent: {
        active: "font-medium text-primary-500",
        regular: " text-neutral-700",
      },
    },
    defaultVariants: {
      intent: "regular",
    },
  },
);

type WishNavProps = ComponentProps<"button">;

export interface Props extends WishNavProps, VariantProps<typeof buttonStyles> {
  name: string;
}

export const WishNavButton = ({ name, intent, ...props }: Props) => {
  return (
    <button type="button" className={buttonStyles({ intent })} {...props}>
      {name}
    </button>
  );
};
