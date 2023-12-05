import { cn } from "@/lib/utils";
import { type ComponentProps } from "react";

type HeadingProps = ComponentProps<"h2">;

interface Props extends HeadingProps {
  title: string;
}

export const SectionTitle = ({ title, className, ...props }: Props) => {
  return (
    <h2
      className={cn("text-4xl font-bold capitalize text-slate-800", className)}
      {...props}
    >
      {title}
    </h2>
  );
};
