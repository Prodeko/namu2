import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { type ComponentPropsWithRef, type ForwardedRef } from "react";
import { type IconType } from "react-icons";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "flex flex-1 items-center justify-center gap-2 rounded-full px-5  py-3 text-lg font-bold capitalize md:gap-2.5 md:px-9 md:py-5 md:text-2xl landscape:py-3 landscape:text-lg ",
  {
    variants: {
      intent: {
        primary: "bg-primary-400 text-primary-50",
        secondary: "border-2 border-primary-400 bg-primary-50 text-primary-400",
        tertiary: "border-2 border-primary-500 text-primary-500",
        header:
          "border-2 border-none bg-primary-50 text-primary-500 shadow-inner",
      },
      fullwidth: {
        true: "w-full",
      },
      loading: {
        true: "animate-pulse cursor-not-allowed",
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
  loading?: boolean;
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

const iconSize = 24;

export const FatButton = ({ ref, ...props }: Props) => {
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
        {LeftIcon && <span>{<LeftIcon size={iconSize} />}</span>}
        <span>{text}</span>
        {RightIcon && <span>{<RightIcon size={iconSize} />}</span>}
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
    loading,
    ...restProps
  } = props;
  return (
    <button
      {...restProps}
      type={restProps.type}
      ref={ref as RefProps<ButtonProps>}
      className={cn(buttonStyles({ intent, fullwidth, loading }), className)}
      disabled={loading}
    >
      {LeftIcon && <span>{<LeftIcon size={iconSize} />}</span>}
      <span>{text}</span>
      {RightIcon && !loading && <span>{<RightIcon size={iconSize} />}</span>}
      {loading && (
        <span className="animate-spin">
          {<AiOutlineLoading3Quarters size={iconSize} />}
        </span>
      )}
    </button>
  );
};
