import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import { type IconType } from "react-icons";

interface BaseProps {
  text: string;
  Icon: IconType;
}

interface ButtonProps extends ComponentPropsWithoutRef<"button">, BaseProps {
  buttonType: "button";
}

interface LinkProps extends ComponentPropsWithoutRef<"a">, BaseProps {
  buttonType: "a";
  href: string;
}

type Props = ButtonProps | LinkProps;

export const DropdownItem = (props: Props) => {
  if (props.buttonType === "a") {
    const { text, Icon, href, buttonType, ...restProps } = props;
    return (
      <Link
        {...restProps}
        href={href}
        className="font-md flex items-center justify-between gap-4 px-7 py-5 text-2xl font-semibold active:backdrop-brightness-95"
      >
        <span className="text-neutral-800">{text}</span>
        <Icon className="text-neutral-600" size={32} />
      </Link>
    );
  }
  const { text, Icon, buttonType, ...restProps } = props;
  return (
    <button
      {...restProps}
      type={restProps.type}
      className="font-md flex items-center justify-between gap-4 px-7 py-5 text-2xl font-semibold active:backdrop-brightness-95"
    >
      <span className="text-neutral-800">{text}</span>
      <Icon className="text-neutral-600" size={32} />
    </button>
  );
};
