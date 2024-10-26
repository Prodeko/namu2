import { cva } from "class-variance-authority";
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

const buttonStyles = cva(
  "font-md flex w-full items-center justify-between gap-4 px-5 py-4 text-lg font-semibold active:backdrop-brightness-95 md:px-7 md:py-5 md:text-2xl",
);

export const DropdownItem = (props: Props) => {
  if (props.buttonType === "a") {
    const { text, Icon, href, buttonType, ...restProps } = props;
    return (
      <Link {...restProps} href={href} className={buttonStyles()}>
        <span className="text-neutral-800">{text}</span>
        <Icon className="text-2xl text-neutral-600 md:text-4xl" />
      </Link>
    );
  }
  const { text, Icon, buttonType, ...restProps } = props;
  return (
    <button {...restProps} type={restProps.type} className={buttonStyles()}>
      <span className="text-neutral-800">{text}</span>
      <Icon className="text-2xl text-neutral-600 md:text-4xl" />
    </button>
  );
};
