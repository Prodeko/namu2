import Link from "next/link";
import { type IconType } from "react-icons";

interface DropdownItemProps {
  href: string;
  text: string;
  Icon: IconType;
}

export const DropdownItem = ({ href, text, Icon }: DropdownItemProps) => {
  return (
    <Link
      href={href}
      className="font-md flex items-center justify-between gap-4 px-7 py-5 text-2xl font-semibold text-neutral-800 active:backdrop-brightness-95"
    >
      <span>{text}</span>
      <Icon size={40} />
    </Link>
  );
};
