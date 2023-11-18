import { type ComponentProps } from "react";

type HeadingProps = ComponentProps<"h2">;

interface Props extends HeadingProps {
  title: string;
}

export const SectionTitle = ({ title, ...props }: Props) => {
  return (
    <h2 className="pt-6 text-4xl font-bold capitalize text-gray-700" {...props}>
      {title}
    </h2>
  );
};
