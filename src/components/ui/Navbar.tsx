import { type ComponentProps } from "react";
import { HiLogout, HiShoppingCart } from "react-icons/hi";
import { HiWallet } from "react-icons/hi2";

import { FatButton } from "./Buttons/FatButton";
import { IconButton } from "./Buttons/IconButton";

type NavProps = ComponentProps<"nav">;

export type Props = NavProps;

export const NavBar = ({ ...props }: Props) => {
  return (
    <nav className="flex gap-6" {...props}>
      <FatButton
        buttonType="button"
        intent={"secondary"}
        text="Wallet"
        RightIcon={HiWallet}
      />
      <IconButton buttonType="button" sizing="md" Icon={HiShoppingCart} />
      <IconButton buttonType="a" href="/" sizing="md" Icon={HiLogout} />
    </nav>
  );
};
