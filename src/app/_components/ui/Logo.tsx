import { type ComponentProps } from "react";

type HeadingProps = ComponentProps<"a">;

type Props = HeadingProps;

export const Logo = ({ ...props }: Props) => {
  return (
    <a
      href="/"
      {...props}
      className="text-primary-500 text-5xl font-black uppercase italic"
    >
      Namukilke
    </a>
  );
};
