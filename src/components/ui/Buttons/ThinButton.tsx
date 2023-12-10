import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { type ComponentPropsWithRef } from "react";
import { type IconType } from "react-icons";

import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "flex items-center justify-center gap-1.5 rounded-full px-7 py-3.5 text-xl font-medium capitalize",
  {
    variants: {
      intent: {
        primary: "bg-primary-400 text-primary-50",
        secondary: "bg-primary-100 text-primary-400",
        tertiary: "border-2 border-primary-400 text-primary-400",
      },
      fullwidth: {
        true: "w-full",
      },
    },
  },
);
type ButtonVariantProps = VariantProps<typeof buttonStyles>;

interface BaseProps {
  text: string;
  LeftIcon?: IconType;
  RightIcon?: IconType;
}

interface ButtonProps
  extends BaseProps,
    ComponentPropsWithRef<"button">,
    Omit<ButtonVariantProps, "intent">,
    Required<Pick<ButtonVariantProps, "intent">> {
  buttonType: "button";
}

export interface LinkProps
  extends BaseProps,
    ComponentPropsWithRef<"a">,
    Omit<ButtonVariantProps, "intent">,
    Required<Pick<ButtonVariantProps, "intent">> {
  buttonType: "a";
  href: string;
}

type Props = LinkProps | ButtonProps;

export const ThinButton = (props: Props) => {
  if (props.buttonType === "a") {
    const {
      text,
      href,
      LeftIcon,
      RightIcon,
      intent,
      fullwidth,
      buttonType,
      className,
      ...restProps
    } = props;
    return (
      <Link
        {...restProps}
        href={href}
        className={cn(buttonStyles({ intent, fullwidth }))}
      >
        {LeftIcon && <span>{<LeftIcon size={24} />}</span>}
        <span>{text}</span>
        {RightIcon && <span>{<RightIcon size={24} />}</span>}
      </Link>
    );
  }

  const {
    text,
    LeftIcon,
    RightIcon,
    intent,
    fullwidth,
    buttonType,
    className,
    ...restProps
  } = props;
  return (
    <button
      {...restProps}
      type="button"
      className={cn(buttonStyles({ intent, fullwidth }))}
    >
      {LeftIcon && <span>{<LeftIcon size={24} />}</span>}
      <span>{text}</span>
      {RightIcon && <span>{<RightIcon size={24} />}</span>}
    </button>
  );
};
