import { FiMenu } from "react-icons/fi";
import { HiChartBar, HiCog, HiOutlineLogout } from "react-icons/hi";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { IconButton } from "../Buttons/IconButton";
import { DropdownItem } from "./DropdownItem";

export const HeaderDropdown = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton buttonType="button" sizing="md" Icon={FiMenu} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        alignOffset={-5}
        className="z-20 rounded-lg bg-neutral-50"
      >
        <DropdownMenu.Item>
          <DropdownItem href="/account" text="Account" Icon={HiCog} />
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[1px] bg-neutral-200" />

        <DropdownMenu.Item>
          <DropdownItem href="/stats" text="Stats" Icon={HiChartBar} />
        </DropdownMenu.Item>
        <DropdownMenu.Separator className="h-[2px] bg-neutral-200" />

        <DropdownMenu.Item>
          <DropdownItem href="/" text="Log out" Icon={HiOutlineLogout} />
        </DropdownMenu.Item>
        <DropdownMenu.Arrow className="fill-neutral-50" />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
