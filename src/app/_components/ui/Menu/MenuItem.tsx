import { type IconType } from "react-icons";

import { Menu, type MenuItemProps } from "@headlessui/react";

interface Props extends MenuItemProps<"div"> {
  Icon: IconType;
  text: string;
}

export const MenuItem = ({ Icon, text, ...props }: Props) => {
  return (
    <Menu.Item
      {...props}
      className={"flex w-64 items-center gap-6 p-4 text-2xl font-medium"}
      as="div"
    >
      <Icon size={"2.4rem"} />
      <span className="capitalize">{text}</span>
    </Menu.Item>
  );
};
