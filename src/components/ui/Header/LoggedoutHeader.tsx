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
      className="flex h-36 flex-row-reverse items-center justify-between bg-primary-200 px-12"
    >
      <nav className="flex gap-6" {...props}>
        <ThinButton
          buttonType="a"
          href="/admin/login"
          intent="secondary"
          RightIcon={HiLockClosed}
          text="admin"
        />
      </nav>
      {pathName === "/newaccount" && <Logo href="/" />}
    </header>
  );
};
