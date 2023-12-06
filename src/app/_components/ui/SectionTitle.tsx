import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

type HeadingProps = ComponentProps<"h2">;

interface Props extends HeadingProps {
  title: string;
}

export const SectionTitle = ({ title, className, ...props }: Props) => {
  return (
    <h2
      className={cn(
        "text-4xl font-bold capitalize text-neutral-800",
        className,
      )}
      {...props}
    >
      {title}
    </h2>
  );
};
