"use client";

import { VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentProps } from "react";
import { IconType } from "react-icons";

const buttonStyles = cva("flex items-center justify-between px-9 py-6", {
  variants: {
    active: {
      true: "bg-primary-400",
    },
  },
});

const iconStyles = cva("", {
  variants: {
    active: {
      true: "text-white",
      false: "text-primary-400",
      locked: "text-neutral-300",
    },
  },
});

const spanStyles = cva("text-xl 2xl:text-2xl", {
  variants: {
    active: {
      true: "font-medium text-white",
      false: "font-normal text-neutral-700",
      locked: "cursor-not-allowed select-none font-normal text-neutral-400",
    },
  },
});

interface Props
  extends ComponentProps<"div">,
    VariantProps<typeof buttonStyles> {
  text: string;
  Icon: IconType;
  href: string;
  unavailable?: boolean;
}

export const SidebarItem = ({
  text,
  Icon,
  href,
  unavailable = false,
}: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  if (unavailable) {
    return (
      <div className={buttonStyles({ active: false })}>
        <span className={spanStyles({ active: "locked" })}>{text}</span>
        <Icon size={36} className={iconStyles({ active: "locked" })} />
      </div>
    );
  }

  return (
    <Link href={href} className={buttonStyles({ active })}>
      <span className={spanStyles({ active })}>{text}</span>
      <Icon size={36} className={iconStyles({ active })} />
    </Link>
  );
};
