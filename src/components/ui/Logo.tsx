import Link from "next/link";
import { type ComponentPropsWithRef } from "react";

type LinkProps = ComponentPropsWithRef<"a">;

interface Props extends LinkProps {
  href: string;
}

export const Logo = ({ href, ...props }: Props) => {
  return (
    <Link
      href={href}
      {...props}
      className="text-5xl font-black uppercase italic text-primary-500"
    >
      Namukilke
    </Link>
  );
};
