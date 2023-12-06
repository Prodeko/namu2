import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentPropsWithRef } from "react";
import { IconType } from "react-icons";

type LinkProps = ComponentPropsWithRef<"a">;

interface Props extends LinkProps {
  Icon: IconType;
  href: string;
  pageName: string;
}

export const FooterLink = ({ Icon, href, pageName, ...props }: Props) => {
  const pathName = usePathname();
  const active = pathName === href;
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-2 transition-all ${
        active ? "text-primary-600" : "text-neutral-600"
      }`}
      {...props}
    >
      <Icon size={56} />
      <span className="text-2xl font-medium">{pageName}</span>
    </Link>
  );
};
