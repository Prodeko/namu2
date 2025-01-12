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
      className="text-xl font-black uppercase italic text-primary-500 md:text-3xl 2xl:text-4xl"
    >
      Namukilke
    </Link>
  );
};
