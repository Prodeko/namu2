import { cva } from "class-variance-authority";
import Link from "next/link";
import { type ComponentProps } from "react";
import { IconType } from "react-icons";
import { callbackify } from "util";

interface Props extends ComponentProps<"div"> {
  text: string;
  Icon: IconType;
  href: string;
  intent: "active" | "default";
  callback: () => void;
}

const buttonStyles = cva("flex items-center justify-between px-9 py-6", {
  variants: {
    intent: {
      active: "bg-primary-50",
      default: "",
    },
  },
});

export const SidebarItem = ({ text, Icon, href, intent, callback }: Props) => {
  return (
    <Link href={href}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div onClick={callback} className={buttonStyles({ intent: intent })}>
        <span className="text-2xl text-neutral-700">{text}</span>
        <Icon size={36} className="text-primary-400" />
      </div>
    </Link>
  );
};
