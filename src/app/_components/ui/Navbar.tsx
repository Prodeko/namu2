import { type ComponentProps } from "react";
import { HiWallet } from "react-icons/hi2";

import { IconButton } from "./Buttons/IconButton";
import { FatButton } from "./Buttons/FatButton";
import { HiLogout, HiShoppingCart } from "react-icons/hi";

type NavProps = ComponentProps<"nav">;

export interface Props extends NavProps {}

export const NavBar = ({ ...props }: Props) => {
  return (
    <nav className="flex gap-6" {...props}>
      <FatButton buttonType="button" intent={"secondary"} text="Wallet" RightIcon={HiWallet} />
      <IconButton buttonType="button" sizing="md" Icon={HiShoppingCart} />
      <IconButton buttonType="a" href="/" sizing="md" Icon={HiLogout} />
    </nav>
  );
};
