import { type ComponentProps } from "react";

type SpanProps = ComponentProps<"span">;

interface Props extends SpanProps {
  label: string;
  value: string;
}

export const TextLine = ({ label, value, ...props }: Props) => {
  return (
    <div className="flex justify-between text-pink-400">
      <span>
        {label}
        {label && ":"}
      </span>
      <span>{value}</span>
    </div>
  );
};
