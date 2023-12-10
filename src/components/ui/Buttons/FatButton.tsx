import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import {
  type ComponentPropsWithRef,
  type ForwardedRef,
  forwardRef,
} from "react";
import { type IconType } from "react-icons";

import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "flex items-center justify-center gap-2.5 rounded-full px-9 py-[1.125rem] text-2xl font-bold capitalize",
  {
    variants: {
      intent: {
        primary: "bg-primary-500 text-primary-50",
        secondary: "border-4 border-primary-500 bg-primary-50 text-primary-500",
        tertiary: "border-4 border-primary-500 text-primary-500",
        header:
          "border-4 border-none bg-primary-50 text-primary-500 shadow-inner",
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
type RefProps<T extends Props> = T extends LinkProps
  ? ForwardedRef<HTMLAnchorElement>
  : ForwardedRef<HTMLButtonElement>;

export const FatButton = forwardRef((props: Props, ref: RefProps<Props>) => {
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
        ref={ref as RefProps<LinkProps>}
        className={cn(buttonStyles({ intent, fullwidth }), className)}
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
      ref={ref as RefProps<ButtonProps>}
      className={cn(buttonStyles({ intent, fullwidth }), className)}
    >
      {LeftIcon && <span>{<LeftIcon size={24} />}</span>}
      <span>{text}</span>
      {RightIcon && <span>{<RightIcon size={24} />}</span>}
    </button>
  );
});
