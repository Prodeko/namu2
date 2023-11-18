import { type ComponentProps } from "react";

type HeadingProps = ComponentProps<"a">;

interface Props extends HeadingProps {
  path: string;
}

export const Logo = ({ path, ...props }: Props) => {
  return (
    <a
      href={path}
      {...props}
      className="text-5xl font-black uppercase italic text-pink-500"
    >
      Namukilke
    </a>
  );
};
