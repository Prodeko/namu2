import { type ComponentProps } from "react";

type SpanProps = ComponentProps<"span">;

interface Props extends SpanProps {
  label: string;
  value: string;
}

export const TextLine = ({ label, value, ...props }: Props) => {
  return (
    <div className="text-primary-400 flex justify-between">
      <span>
        {label}
        {label && ":"}
      </span>
      <span>{value}</span>
    </div>
  );
};
