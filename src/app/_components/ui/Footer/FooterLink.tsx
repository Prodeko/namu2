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
      className={`flex flex-col gap-2 items-center transition-all ${
        active ? "text-pink-600" : "text-slate-600"
      }`}
      {...props}
    >
      <Icon size={56} />
      <span className="text-2xl font-medium">{pageName}</span>
    </Link>
  );
};
