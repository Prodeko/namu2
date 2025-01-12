"use client";

import { VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentProps } from "react";
import { IconType } from "react-icons";

const buttonStyles = cva(
  "flex w-full flex-col-reverse items-center justify-center px-3 py-3 portrait:gap-1 landscape:flex-row landscape:justify-between landscape:px-9 landscape:py-6",
  {
    variants: {
      active: {
        true: "",
      },
    },
  },
);

const iconStyles = cva("text-2xl landscape:text-4xl", {
  variants: {
    active: {
      true: "text-primary-400",
      false: "text-neutral-400",
      locked: "text-neutral-300",
    },
  },
});

const spanStyles = cva("text-center text-xs 2xl:text-2xl landscape:text-left", {
  variants: {
    active: {
      true: "font-medium text-primary-500",
      false: "font-normal text-neutral-500 ",
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
        <Icon className={iconStyles({ active: "locked" })} />
      </div>
    );
  }

  return (
    <Link href={href} className={buttonStyles({ active })}>
      <span className={spanStyles({ active })}>{text}</span>
      <Icon className={iconStyles({ active })} />
    </Link>
  );
};
