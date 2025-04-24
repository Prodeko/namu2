"use client";

import { usePathname } from "next/navigation";
import { type ComponentProps } from "react";
import { HiLockClosed } from "react-icons/hi2";

import { ThinButton } from "../Buttons/ThinButton";
import { Logo } from "../Logo";

type HeaderProps = ComponentProps<"header">;

type Props = HeaderProps;

export const LoggedoutHeader = ({ ...props }: Props) => {
  const pathName = usePathname();
  return (
    <header
      {...props}
      className="flex w-full flex-row items-center justify-center bg-primary-200 px-12 py-6 md:h-36 "
    >
      <Logo href="/login" />
    </header>
  );
};
