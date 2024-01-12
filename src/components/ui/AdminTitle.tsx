import { type ComponentProps } from "react";

import { cn } from "@/lib/utils";

type HeadingProps = ComponentProps<"h2">;

interface Props extends HeadingProps {
  title: string;
}

export const AdminTitle = ({ title, className, ...props }: Props) => {
  return (
    <h2
      className={cn(
        "sticky top-0 z-10  bg-neutral-50 text-4xl font-semibold text-neutral-700 2xl:text-5xl",
        className,
      )}
      {...props}
    >
      {title}
    </h2>
  );
};
