import { cva } from "class-variance-authority";
import Link from "next/link";
import { type ComponentPropsWithRef } from "react";
import { HiChevronRight } from "react-icons/hi";

import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "flex items-center justify-between gap-4 border-b-2 border-neutral-200 px-12 py-4 text-neutral-400",
);
const textStyles = cva("text-2xl font-medium capitalize text-neutral-800");
const iconSize = 36;

interface BaseProps {
  text: string;
}

interface ButtonProps extends BaseProps, ComponentPropsWithRef<"button"> {
  buttonType: "button";
}

export interface LinkProps extends BaseProps, ComponentPropsWithRef<"a"> {
  buttonType: "a";
  href: string;
}

type Props = LinkProps | ButtonProps;

export const LineButton = (props: Props) => {
  if (props.buttonType === "a") {
    const { href, text, buttonType, className, ...restProps } = props;
    return (
      <Link
        {...restProps}
        href={href}
        className={cn(buttonStyles(), className)}
      >
        <span className={textStyles()}>{text}</span>
        <HiChevronRight size={iconSize} />
      </Link>
    );
  }

  const { text, buttonType, className, ...restProps } = props;
  return (
    <button
      {...restProps}
      type="button"
      className={cn(buttonStyles(), className)}
    >
      <span className={textStyles()}>{text}</span>
      <HiChevronRight size={iconSize} />
    </button>
  );
};
