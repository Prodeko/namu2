import { type VariantProps, cva } from "class-variance-authority";
import { ComponentPropsWithoutRef } from "react";

const styles = cva("whitespace-nowrap text-neutral-500", {
  variants: {
    sizing: {
      "2xl": "text-2xl",
      xl: "text-xl",
      lg: "text-lg",
      md: "text-md",
      sm: "text-sm",
    },
  },
});

interface Props
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof styles> {
  text: string;
}

export const PromptText = ({ text, sizing, ...props }: Props) => {
  return (
    <span {...props} className={styles({ sizing })}>
      {text}
    </span>
  );
};
